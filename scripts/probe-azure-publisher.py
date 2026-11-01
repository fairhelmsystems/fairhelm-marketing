#!/usr/bin/env python3
"""Check publisher read access without uploading, deleting or changing routes."""
import importlib.util
import sys
from pathlib import Path

spec = importlib.util.spec_from_file_location('stage', Path(__file__).with_name('stage-azure-release.py'))
stage = importlib.util.module_from_spec(spec)
spec.loader.exec_module(stage)


def verify():
    routes = stage.read_routes()
    stage.require(set(routes) == set(stage.ACCOUNTS), 'Route set differs')
    for site, account in stage.ACCOUNTS.items():
        stage.require('index.html' in stage.list_blobs(account, routes[site]),
                      f'{site}: active release inventory is unavailable')
    return len(routes)


if __name__ == '__main__':
    try:
        print(f'Publisher read five routes and {verify()} active release inventories')
    except (ValueError, OSError, KeyError, TypeError) as exc:
        print(f'Publisher access probe stopped: {exc}', file=sys.stderr)
        sys.exit(1)
