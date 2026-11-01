#!/usr/bin/env python3
"""Stage five prepared sites under create-only Azure release prefixes.

The caller must authenticate the producer and recheck live routes before
promotion. This command never changes
routes, deletes blobs, resumes a partial prefix, or grants permissions.
"""
import importlib.util
import json
import os
from pathlib import Path
import re
import subprocess
import sys
import tempfile
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parent

def load(name, filename):
    spec = importlib.util.spec_from_file_location(name, ROOT / filename)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module

prepare = load('prepare_azure_release', 'prepare-azure-release.py')
verify = load('verify_azure_release', 'verify-azure-release.py')
ACCOUNTS = {site: host.split('.')[0] for site, host in verify.ORIGINS.items()}
SUBSCRIPTION = '4a48b271-82c2-4485-a57c-e5084371ed45'
REPO = 'Fairhelm-Systems-Pvt-Ltd/fairhelm_systems.marketing'
PROFILE = (f'/subscriptions/{SUBSCRIPTION}/resourceGroups/rg-squarecampus-frontend-prod/'
           'providers/Microsoft.Cdn/profiles/afd-squarecampus-frontend')


def require(condition, message):
    if not condition:
        raise ValueError(message)


def command(args):
    try:
        result = subprocess.run(args, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                                check=False, timeout=1800)
    except (OSError, subprocess.TimeoutExpired) as exc:
        raise ValueError('Azure command did not complete; reconcile before retrying') from exc
    require(result.returncode == 0 and len(result.stdout) < 32 * 1024 * 1024,
            'Azure command failed; reconcile partial effects before retrying')
    try:
        return json.loads(result.stdout)
    except (ValueError, UnicodeError) as exc:
        raise ValueError('Azure command returned invalid JSON') from exc


def read_routes():
    commits = {}
    for site in ACCOUNTS:
        route_id = f'{PROFILE}/afdEndpoints/fde-sc-mkt-{site}/routes/route-sc-mkt-{site}'
        route = command(['az', 'rest', '--method', 'get', '--url',
                         f'https://management.azure.com{route_id}?api-version=2024-02-01', '-o', 'json'])
        properties = route.get('properties') or {}
        require(isinstance(route.get('id'), str) and route['id'].lower() == route_id.lower()
                and properties.get('enabledState') == 'Enabled' and properties.get('provisioningState') == 'Succeeded'
                and isinstance((properties.get('originGroup') or {}).get('id'), str)
                and (properties['originGroup']['id']).lower() == f'{PROFILE}/originGroups/og-sc-mkt-{site}'.lower(),
                f'{site}: route identity or state is unexpected')
        path = properties.get('originPath')
        match = re.fullmatch(r'/releases/([0-9a-f]{40})', path) if isinstance(path, str) else None
        require(bool(match), f'{site}: route does not name an immutable release')
        commits[site] = match[1]
    return commits


def list_blobs(account, commit):
    prefix = f'releases/{commit}/'
    rows = command(['az', 'storage', 'blob', 'list', '--account-name', account,
                    '--container-name', '$web', '--prefix', prefix, '--num-results', '*',
                    '--auth-mode', 'login', '--only-show-errors', '-o', 'json'])
    require(isinstance(rows, list), 'Unexpected blob inventory')
    names = set()
    for row in rows:
        require(isinstance(row, dict) and isinstance(row.get('name'), str), 'Invalid blob entry')
        name = row['name']; require(name.startswith(prefix), 'Unexpected blob prefix')
        relative = name[len(prefix):]
        require(relative and all(part not in ('', '.', '..') for part in relative.split('/'))
                and relative not in names, 'Unsafe or duplicate blob name')
        names.add(relative)
    return names


def files_in(directory):
    require(directory.is_dir() and not directory.is_symlink(), 'Invalid prepared directory')
    paths = set()
    for item in directory.rglob('*'):
        require(not item.is_symlink(), 'Symlink is forbidden')
        if item.is_dir(): continue
        require(item.is_file(), 'Unsupported prepared entry')
        paths.add(item.relative_to(directory).as_posix())
    require('index.html' in paths, 'Prepared site missing index.html')
    return paths


def download_previous(commits, destination):
    require(isinstance(commits, dict) and set(commits) == set(ACCOUNTS)
            and all(isinstance(c, str) and re.fullmatch(r'[0-9a-f]{40}', c) for c in commits.values()),
            'Previous commits must identify all five sites')
    require(destination.is_dir() and not destination.is_symlink() and not any(destination.iterdir()),
            'Previous download directory must be empty')
    previous = destination / 'previous'
    previous.mkdir()
    for site, commit in commits.items():
        expected = list_blobs(ACCOUNTS[site], commit)
        require('index.html' in expected, f'{site}: previous release missing index.html')
        download = destination / f'download-{site}'
        download.mkdir()
        command(['az', 'storage', 'blob', 'download-batch', '--account-name', ACCOUNTS[site],
                 '--source', '$web', '--destination', str(download), '--pattern', f'releases/{commit}/*',
                 '--auth-mode', 'login', '--overwrite', 'false', '--no-progress', '--only-show-errors', '-o', 'json'])
        downloaded = download / 'releases' / commit
        require(files_in(downloaded) == expected, f'{site}: downloaded inventory differs')
        verify.verify(downloaded, site, commit)
        downloaded.rename(previous / site)
    return previous


def stage_site(site, commit, prepared):
    require(site in ACCOUNTS and re.fullmatch(r'[0-9a-f]{40}', commit), 'Invalid site or commit')
    expected = files_in(prepared); account = ACCOUNTS[site]
    require(not list_blobs(account, commit), 'Release prefix already populated; reconcile manually')
    result = command(['az', 'storage', 'blob', 'upload-batch', '--account-name', account,
                      '--destination', '$web', '--destination-path', f'releases/{commit}',
                      '--source', str(prepared), '--auth-mode', 'login', '--overwrite', 'false',
                      '--if-none-match', '*', '--validate-content', '--no-progress',
                      '--only-show-errors', '-o', 'json'])
    require(isinstance(result, list) and len(result) == len(expected),
            'Upload returned incomplete results; reconcile before retrying')
    uploaded = set()
    for entry in result:
        require(isinstance(entry, dict) and isinstance(entry.get('Blob'), str), 'Invalid upload receipt')
        url = urlsplit(entry['Blob'])
        prefix = f'/$web/releases/{commit}/'
        path = unquote(url.path)
        require(url.scheme == 'https' and url.hostname == f'{account}.blob.core.windows.net'
                and not url.query and not url.fragment and path.startswith(prefix), 'Unexpected upload receipt')
        relative = path[len(prefix):]
        require(relative in expected and relative not in uploaded and entry.get('eTag'), 'Invalid upload receipt')
        uploaded.add(relative)
    require(uploaded == expected, 'Upload receipts differ from prepared files')
    require(list_blobs(account, commit) == expected, 'Uploaded blob inventory differs; do not promote')
    verify.verify(prepared, site, commit)


def stage(release, commit, previous, previous_commits, output):
    require(re.fullmatch(r'[0-9a-f]{40}', commit), 'Invalid commit')
    require(isinstance(previous_commits, dict) and set(previous_commits) == set(ACCOUNTS)
            and all(isinstance(c, str) and re.fullmatch(r'[0-9a-f]{40}', c) for c in previous_commits.values()),
            'Previous commits must identify all five sites')
    require(not output.exists() and not output.is_symlink(), 'Output already exists')
    for site, old_commit in previous_commits.items():
        old = previous / site
        require(list_blobs(ACCOUNTS[site], old_commit) == files_in(old),
                f'{site}: previous release inventory differs')
        verify.verify(old, site, old_commit)
    prepare.prepare(release, commit, previous, output)
    for site in ACCOUNTS:
        stage_site(site, commit, output / site)


def orchestrate(release, commit, output):
    commits = read_routes()
    with tempfile.TemporaryDirectory(prefix='marketing-previous-') as temporary:
        previous = download_previous(commits, Path(temporary))
        stage(release, commit, previous, commits, output)
    require(read_routes() == commits, 'Live routes changed during staging; do not promote')
    return {'commit': commit, 'previous': commits, 'status': 'staged'}


def context(commit):
    require(os.environ.get('GITHUB_ACTIONS') == 'true' and os.environ.get('GITHUB_REPOSITORY') == REPO
            and os.environ.get('GITHUB_REF') == 'refs/heads/main' and os.environ.get('GITHUB_REF_PROTECTED') == 'true'
            and os.environ.get('GITHUB_EVENT_NAME') == 'push' and os.environ.get('GITHUB_RUN_ATTEMPT') == '1'
            and os.environ.get('GITHUB_SHA') == commit,
            'Protected marketing main push context required')
    client = os.environ.get('AZURE_MARKETING_PUBLISHER_CLIENT_ID', '')
    require(re.fullmatch(r'[0-9a-fA-F-]{36}', client), 'Publisher client identity missing')
    account = command(['az', 'account', 'show', '-o', 'json'])
    require(account.get('id') == SUBSCRIPTION and (account.get('user') or {}).get('name', '').lower() == client.lower()
            and (account.get('user') or {}).get('type') == 'servicePrincipal', 'Wrong Azure publisher identity')


if __name__ == '__main__':
    if len(sys.argv) != 4:
        raise SystemExit('usage: stage-azure-release.py RELEASE_DIR COMMIT OUTPUT_DIR')
    try:
        release, commit, output = sys.argv[1:]
        context(commit)
        print(json.dumps(orchestrate(Path(release), commit, Path(output)), sort_keys=True))
    except (ValueError, OSError) as exc:
        print(f'Marketing staging refused: {exc}', file=sys.stderr)
        sys.exit(1)
