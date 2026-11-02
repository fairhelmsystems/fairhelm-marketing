#!/usr/bin/env python3
"""Compare a prepared site's files to its immutable Azure static-website prefix."""
import hashlib
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import re
import sys
from urllib.parse import quote
from urllib.request import urlopen

ORIGINS = {
    'squarecampus': 'stscmktsquare4a48.z29.web.core.windows.net',
    'fairhelm': 'stscmktfairhelm4a48.z29.web.core.windows.net',
    'blogs': 'stscmktblogs4a48.z29.web.core.windows.net',
    'legal': 'stscmktlegal4a48.z29.web.core.windows.net',
    'press': 'stscmktpress4a48.z29.web.core.windows.net',
}


def verify(site_dir, site, commit):
    if site not in ORIGINS or not re.fullmatch(r'[0-9a-f]{40}', commit):
        raise ValueError('Invalid site or release commit')
    if site_dir.is_symlink() or not site_dir.is_dir():
        raise ValueError('Prepared site directory is missing or unsafe')
    files = []
    for path in site_dir.rglob('*'):
        if path.is_symlink():
            raise ValueError('Symlink in prepared site')
        if path.is_dir():
            continue
        if not path.is_file():
            raise ValueError('Unsupported prepared site entry')
        files.append(path)
    if not (site_dir / 'index.html').is_file():
        raise ValueError('Prepared site is missing index.html')
    base = f'https://{ORIGINS[site]}/releases/{commit}/'
    def verify_file(path):
        relative = path.relative_to(site_dir).as_posix()
        expected = hashlib.sha256()
        with path.open('rb') as source:
            for chunk in iter(lambda: source.read(1024 * 1024), b''):
                expected.update(chunk)
        received = hashlib.sha256()
        with urlopen(base + quote(relative, safe='/'), timeout=30) as response:
            if response.status != 200:
                raise ValueError(f'Origin returned non-200 for {relative}')
            expected_types = {
                '.html': {'text/html'},
                '.css': {'text/css'},
                '.js': {'text/javascript', 'application/javascript', 'application/x-javascript'},
            }
            allowed = expected_types.get(path.suffix.lower())
            content_type = response.headers.get('Content-Type', '').split(';', 1)[0].strip().lower()
            if allowed and content_type not in allowed:
                raise ValueError(f'Origin content type differs for {relative}')
            for chunk in iter(lambda: response.read(1024 * 1024), b''):
                received.update(chunk)
        if expected.digest() != received.digest():
            raise ValueError(f'Origin bytes differ for {relative}')

    # Each immutable file is independent. Bound parallel reads to avoid a long
    # serial verification while keeping origin load predictable; consuming all
    # results ensures every failure still rejects the whole release.
    with ThreadPoolExecutor(max_workers=8) as executor:
        list(executor.map(verify_file, sorted(files)))
    print(f'Verified {len(files)} {site} files at Azure origin for {commit}')


if __name__ == '__main__':
    if len(sys.argv) != 4:
        raise SystemExit('usage: verify-azure-release.py PREPARED_SITE SITE COMMIT')
    verify(Path(sys.argv[1]), sys.argv[2], sys.argv[3])
