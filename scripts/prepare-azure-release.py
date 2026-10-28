#!/usr/bin/env python3
"""Prepare immutable release contents while retaining previous Next static assets.

The caller must independently obtain and verify the current release's blob
contents before supplying PREVIOUS_DIR; this script performs no Azure operations.
Callers must serialize writers to the destination path.
"""
import hashlib
import importlib.util
from pathlib import Path
import shutil
import sys
import tarfile
import tempfile

spec = importlib.util.spec_from_file_location("release_check", Path(__file__).with_name("check-release-artifact.py"))
release_check = importlib.util.module_from_spec(spec)
spec.loader.exec_module(release_check)


def sha256(path):
    h = hashlib.sha256()
    with path.open("rb") as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            h.update(block)
    return h.digest()


def prepare(release, commit, previous, destination):
    release_check.check(release, commit)
    if destination.exists() or destination.is_symlink():
        raise ValueError("Destination already exists")
    if not previous.is_dir() or previous.is_symlink():
        raise ValueError("Previous release must be an independently verified directory")
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
            old_site = previous / site
            old = old_site / "_next" / "static"
            if old_site.is_symlink() or not old_site.is_dir() or old.is_symlink() or not old.is_dir():
                raise ValueError(f"{site}: missing or unsafe previous static assets")
            # Inspect each ancestor too: a symlink in the previous tree must not
            # silently redirect the retention scan outside the verified snapshot.
            if (old_site / "_next").is_symlink():
                raise ValueError(f"{site}: unsafe previous static directory")
            for path in old.rglob("*"):
                if path.is_symlink():
                    raise ValueError(f"{site}: symlink in previous static assets")
                if path.is_dir():
                    continue
                if not path.is_file():
                    raise ValueError(f"{site}: unsupported previous static asset")
                target = site_root / "_next" / "static" / path.relative_to(old)
                if target.exists():
                    if not target.is_file() or sha256(target) != sha256(path):
                        raise ValueError(f"{site}: conflicting static asset {path.relative_to(old)}")
                else:
                    target.parent.mkdir(parents=True, exist_ok=True)
                    shutil.copyfile(path, target)
        # Both paths share a parent filesystem. Do not overwrite an existing release.
        if destination.exists() or destination.is_symlink():
            raise ValueError("Destination appeared during preparation")
        root.rename(destination)
    print(f"Prepared five sites for {commit}; verify uploads before routing")


if __name__ == "__main__":
    if len(sys.argv) != 5:
        raise SystemExit("usage: prepare-azure-release.py RELEASE_DIR EXPECTED_COMMIT PREVIOUS_DIR NEW_DIR")
    prepare(Path(sys.argv[1]), sys.argv[2], Path(sys.argv[3]), Path(sys.argv[4]))
