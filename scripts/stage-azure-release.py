#!/usr/bin/env python3
"""Stage five prepared sites under create-only Azure release prefixes.

Each release prefix holds exactly its build. Content-hashed `_next/static`
files are also published create-only to the shared `static/_next/static/`
prefix, which a dedicated Front Door route serves so earlier builds' chunks
stay available without copying them into every release.

The caller must authenticate the producer and recheck live routes before
promotion. This command never changes
routes, deletes blobs, resumes a partial prefix, or grants permissions.
"""
from concurrent.futures import ThreadPoolExecutor
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import re
import shutil
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
STATIC = '_next/static'
SUBSCRIPTION = '4a48b271-82c2-4485-a57c-e5084371ed45'
REPO = 'Fairhelm-Systems-Pvt-Ltd/fairhelm_systems.marketing'
# Parallel transfers per az batch command (az defaults to 2). Each site has
# its own storage account, so the five sites also run concurrently.
CONNECTIONS = '16'
# Storage account -> private Azure CLI config directory. Concurrent az
# processes never share a token cache; see isolate_configs().
CONFIG_DIRS = {}
PROFILE = (f'/subscriptions/{SUBSCRIPTION}/resourceGroups/rg-squarecampus-frontend-prod/'
           'providers/Microsoft.Cdn/profiles/afd-squarecampus-frontend')


def require(condition, message):
    if not condition:
        raise ValueError(message)


def command(args):
    env = None
    if '--account-name' in args:
        config = CONFIG_DIRS.get(args[args.index('--account-name') + 1])
        if config:
            env = {**os.environ, 'AZURE_CONFIG_DIR': config}
    try:
        result = subprocess.run(args, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                                check=False, timeout=1800, env=env)
    except (OSError, subprocess.TimeoutExpired) as exc:
        raise ValueError('Azure command did not complete; reconcile before retrying') from exc
    require(result.returncode == 0 and len(result.stdout) < 32 * 1024 * 1024,
            'Azure command failed; reconcile partial effects before retrying')
    try:
        return json.loads(result.stdout)
    except (ValueError, UnicodeError) as exc:
        raise ValueError('Azure command returned invalid JSON') from exc


def each_site(work):
    """Run work(site) for all five sites at once; any failure fails the whole release.

    Every site's work finishes (or fails) before this returns, so no write is
    left running behind a refusal. Prefixes stay create-only and unrouted.
    """
    with ThreadPoolExecutor(max_workers=len(ACCOUNTS)) as executor:
        futures = {site: executor.submit(work, site) for site in ACCOUNTS}
    return {site: future.result() for site, future in futures.items()}


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


def list_prefix(account, prefix):
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


def list_blobs(account, commit):
    return list_prefix(account, f'releases/{commit}/')


def files_under(directory):
    require(directory.is_dir() and not directory.is_symlink(), 'Invalid prepared directory')
    paths = {}
    for item in directory.rglob('*'):
        require(not item.is_symlink(), 'Symlink is forbidden')
        if item.is_dir(): continue
        require(item.is_file(), 'Unsupported prepared entry')
        paths[item.relative_to(directory).as_posix()] = item
    return paths


def files_in(directory):
    paths = set(files_under(directory))
    require('index.html' in paths, 'Prepared site missing index.html')
    return paths


def sha256(path):
    digest = hashlib.sha256()
    with path.open('rb') as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b''): digest.update(chunk)
    return digest.digest()


def upload(account, source, destination_path, expected):
    """Create-only batch upload of exactly `expected` names; receipts must match."""
    result = command(['az', 'storage', 'blob', 'upload-batch', '--account-name', account,
                      '--destination', '$web', '--destination-path', destination_path,
                      '--source', str(source), '--auth-mode', 'login', '--overwrite', 'false',
                      '--if-none-match', '*', '--validate-content', '--max-connections', CONNECTIONS,
                      '--no-progress',
                      '--only-show-errors', '-o', 'json'])
    require(isinstance(result, list) and len(result) == len(expected),
            'Upload returned incomplete results; reconcile before retrying')
    uploaded = set()
    prefix = f'/$web/{destination_path}/'
    for entry in result:
        require(isinstance(entry, dict) and isinstance(entry.get('Blob'), str), 'Invalid upload receipt')
        url = urlsplit(entry['Blob'])
        path = unquote(url.path)
        require(url.scheme == 'https' and url.hostname == f'{account}.blob.core.windows.net'
                and not url.query and not url.fragment and path.startswith(prefix), 'Unexpected upload receipt')
        relative = path[len(prefix):]
        require(relative in expected and relative not in uploaded and entry.get('eTag'), 'Invalid upload receipt')
        uploaded.add(relative)
    require(uploaded == expected, 'Upload receipts differ from prepared files')


def publish_shared_static(site, prepared, previous_commit, scratch):
    """Make every chunk this build or the live legacy release references available in the shared prefix.

    Names are content hashes, so a name already present must hold the same
    bytes; origin verification of every candidate enforces that. Releases
    staged before the shared prefix existed carry their (fully retained)
    chunks under their own prefix; those are copied across once.
    """
    account = ACCOUNTS[site]
    own = prepared / '_next' / 'static'
    candidates = files_under(own) if own.is_dir() else {}
    legacy = list_prefix(account, f'releases/{previous_commit}/{STATIC}/')
    if legacy:
        download = scratch / 'legacy'
        download.mkdir(parents=True)
        command(['az', 'storage', 'blob', 'download-batch', '--account-name', account,
                 '--source', '$web', '--destination', str(download),
                 '--pattern', f'releases/{previous_commit}/{STATIC}/*', '--max-connections', CONNECTIONS,
                 '--auth-mode', 'login', '--overwrite', 'false', '--no-progress', '--only-show-errors', '-o', 'json'])
        downloaded = files_under(download / 'releases' / previous_commit / '_next' / 'static')
        require(set(downloaded) == legacy, f'{site}: downloaded legacy static inventory differs')
        for name, path in downloaded.items():
            if name in candidates:
                require(sha256(candidates[name]) == sha256(path), f'{site}: conflicting static asset {name}')
            else:
                candidates[name] = path
    if not candidates:
        return 0
    missing = set(candidates) - list_prefix(account, f'{verify.SHARED_STATIC}/')
    if missing:
        batch = scratch / 'upload'
        for name in missing:
            target = batch.joinpath(*name.split('/'))
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(candidates[name], target)
        upload(account, batch, verify.SHARED_STATIC, missing)
    verify.verify_files(candidates, site, verify.SHARED_STATIC)
    return len(missing)


def stage_site(site, commit, prepared, previous_commit, scratch):
    require(site in ACCOUNTS and re.fullmatch(r'[0-9a-f]{40}', commit)
            and re.fullmatch(r'[0-9a-f]{40}', previous_commit), 'Invalid site or commit')
    expected = files_in(prepared); account = ACCOUNTS[site]
    require(not list_blobs(account, commit), 'Release prefix already populated; reconcile manually')
    # Chunks first: the release's pages must never be reachable before them.
    publish_shared_static(site, prepared, previous_commit, scratch)
    upload(account, prepared, f'releases/{commit}', expected)
    require(list_blobs(account, commit) == expected, 'Uploaded blob inventory differs; do not promote')
    verify.verify(prepared, site, commit)


def stage(release, commit, previous_commits, output, scratch):
    require(re.fullmatch(r'[0-9a-f]{40}', commit), 'Invalid commit')
    require(isinstance(previous_commits, dict) and set(previous_commits) == set(ACCOUNTS)
            and all(isinstance(c, str) and re.fullmatch(r'[0-9a-f]{40}', c) for c in previous_commits.values()),
            'Previous commits must identify all five sites')
    require(not output.exists() and not output.is_symlink(), 'Output already exists')
    require(scratch.is_dir() and not scratch.is_symlink() and not any(scratch.iterdir()),
            'Scratch directory must be empty')
    prepare.prepare(release, commit, output)
    each_site(lambda site: stage_site(site, commit, output / site, previous_commits[site], scratch / site))


def isolate_configs(root):
    """Give each site's storage account a private copy of the logged-in CLI config.

    The storage token is fetched once first, so every copy starts with a valid
    cached token and no two concurrent az processes write the same cache.
    """
    source = os.environ.get('AZURE_CONFIG_DIR', '')
    require(source and Path(source).is_dir() and not Path(source).is_symlink(),
            'AZURE_CONFIG_DIR must name the isolated publisher login')
    command(['az', 'account', 'get-access-token', '--resource', 'https://storage.azure.com/', '-o', 'json'])
    for site, account in ACCOUNTS.items():
        config = root / f'azure-{site}'
        shutil.copytree(source, config, symlinks=True)
        config.chmod(0o700)
        CONFIG_DIRS[account] = str(config)


def orchestrate(release, commit, output):
    commits = read_routes()
    try:
        with tempfile.TemporaryDirectory(prefix='marketing-azure-') as configs, \
                tempfile.TemporaryDirectory(prefix='marketing-scratch-') as temporary:
            isolate_configs(Path(configs))
            stage(release, commit, commits, output, Path(temporary))
    finally:
        CONFIG_DIRS.clear()
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
