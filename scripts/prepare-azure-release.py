#!/usr/bin/env python3
"""Extract the five verified site archives into an immutable release layout.

Each release prefix holds exactly its own build. Content-hashed Next.js assets
are also published to the account's shared `static/_next/static/` prefix by the
stager, which is how earlier builds' chunks stay available; nothing from a
previous release is copied into a new one. This script performs no Azure
operations. Callers must serialize writers to the destination path.
"""
import importlib.util
from pathlib import Path
import shutil
import sys
import tarfile
import tempfile

spec = importlib.util.spec_from_file_location("release_check", Path(__file__).with_name("check-release-artifact.py"))
release_check = importlib.util.module_from_spec(spec)
spec.loader.exec_module(release_check)


def prepare(release, commit, destination):
    release_check.check(release, commit)
    if destination.exists() or destination.is_symlink():
        raise ValueError("Destination already exists")
    if not destination.parent.is_dir():
        raise ValueError("Destination parent does not exist")
    with tempfile.TemporaryDirectory(prefix=".marketing-release-", dir=destination.parent) as temp:
        root = Path(temp) / "release"
        root.mkdir()
        for site in release_check.SITES:
            site_root = root / site
            site_root.mkdir()
            with tarfile.open(release / f"{site}.tar", "r:") as archive:
                for member in archive:
                    name = member.name.removeprefix("./")
                    if member.isdir() and name in ("", "."):
                        continue
                    target = site_root.joinpath(*name.split("/"))
                    if member.isdir():
                        target.mkdir(parents=True, exist_ok=True)
                    else:
                        target.parent.mkdir(parents=True, exist_ok=True)
                        with archive.extractfile(member) as source, target.open("xb") as output:
                            shutil.copyfileobj(source, output)
        # Both paths share a parent filesystem. Do not overwrite an existing release.
        if destination.exists() or destination.is_symlink():
            raise ValueError("Destination appeared during preparation")
        root.rename(destination)
    print(f"Prepared five sites for {commit}; verify uploads before routing")


if __name__ == "__main__":
    if len(sys.argv) != 4:
        raise SystemExit("usage: prepare-azure-release.py RELEASE_DIR EXPECTED_COMMIT NEW_DIR")
    prepare(Path(sys.argv[1]), sys.argv[2], Path(sys.argv[3]))
