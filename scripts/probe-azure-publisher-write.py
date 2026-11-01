#!/usr/bin/env python3
"""Check create-only use and delete denial on one isolated synthetic blob."""
import os
import re
import subprocess
import sys
import urllib.error
import urllib.request

ACCOUNT = 'stscmktsquare4a48'
BASE = f'https://{ACCOUNT}.blob.core.windows.net/$web/'
BODY = b'squarecampus publisher permission probe\n'


def request(token, name, method, body=None, condition=False):
    headers = {'Authorization': 'Bearer ' + token, 'x-ms-version': '2021-12-02'}
    if method == 'PUT':
        headers['x-ms-blob-type'] = 'BlockBlob'
        headers['Content-Type'] = 'text/plain'
    if condition: headers['If-None-Match'] = '*'
    req = urllib.request.Request(BASE + name, data=body, method=method, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            return response.status, None, response.read(1024)
    except urllib.error.HTTPError as exc:
        return exc.code, exc.headers.get('x-ms-error-code', ''), b''


def main():
    run = os.environ.get('GITHUB_RUN_ID', '')
    attempt = os.environ.get('GITHUB_RUN_ATTEMPT', '')
    if not re.fullmatch(r'[1-9][0-9]*', run) or attempt != '1':
        raise ValueError('first-attempt workflow run is required')
    token = subprocess.run(['az', 'account', 'get-access-token', '--resource', 'https://storage.azure.com/',
                            '--query', 'accessToken', '-o', 'tsv'], check=True, stdout=subprocess.PIPE,
                           stderr=subprocess.DEVNULL, text=True, timeout=30).stdout.strip()
    if not token or any(c.isspace() for c in token): raise ValueError('invalid storage token')
    name = f'codex-probes/publisher/{run}-{attempt}.txt'
    created = request(token, name, 'PUT', BODY, True)
    if created[0] != 201: raise ValueError(f'conditional creation failed: HTTP {created[0]}')
    replaced = request(token, name, 'PUT', b'should not overwrite\n', True)
    if replaced[:2] not in ((412, 'ConditionNotMet'), (409, 'BlobAlreadyExists')):
        raise ValueError(f'conditional overwrite was not rejected: HTTP {replaced[0]}, code {replaced[1]}')
    deleted = request(token, name, 'DELETE')
    if deleted[:2] != (403, 'AuthorizationPermissionMismatch'):
        raise ValueError(f'delete denial was not established: HTTP {deleted[0]}')
    observed = request(token, name, 'GET')
    if observed[0] != 200 or observed[2] != BODY: raise ValueError('probe content differs')
    print(f'Conditional create and overwrite guard passed; delete denied; probe blob: {name}')


if __name__ == '__main__':
    try: main()
    except (ValueError, OSError, subprocess.SubprocessError, urllib.error.URLError) as exc:
        print(f'Publisher write probe stopped: {exc}', file=sys.stderr); sys.exit(1)
