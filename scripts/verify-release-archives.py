#!/usr/bin/env python3
"""Verify five release tar files contain exactly their validated build bytes."""
import hashlib
import pathlib
import sys
import tarfile

SITES = ("squarecampus", "fairhelm", "blogs", "legal", "press")


def digest(stream):
    result = hashlib.sha256()
    for block in iter(lambda: stream.read(1024 * 1024), b""):
        result.update(block)
    return result.digest()


def verify(apps, release, site):
    root = apps / site / "out"
    if not root.is_dir() or root.is_symlink():
        raise ValueError(f"{site}: missing or unsafe build directory")
    expected = {}
    for path in root.rglob("*"):
        if path.is_symlink():
            raise ValueError(f"{site}: symlink in build output")
        if path.is_file():
            with path.open("rb") as stream:
                expected[path.relative_to(root).as_posix()] = digest(stream)
        elif not path.is_dir():
            raise ValueError(f"{site}: unsupported build output")
    if "index.html" not in expected:
        raise ValueError(f"{site}: index missing")
    observed = {}
    with tarfile.open(release / f"{site}.tar", "r:") as archive:
        for member in archive:
            name = member.name.removeprefix("./")
            if member.isdir() and name in ("", "."):
                continue
            parts = pathlib.PurePosixPath(name).parts
            if not parts or name.startswith("/") or any(part in (".", "..") for part in parts):
                raise ValueError(f"{site}: unsafe archive path")
            if member.isdir():
                continue
            if not member.isfile() or name in observed:
                raise ValueError(f"{site}: unsafe or duplicate archive entry")
            stream = archive.extractfile(member)
            if stream is None:
                raise ValueError(f"{site}: unreadable archive entry")
            with stream:
                observed[name] = digest(stream)
    if expected != observed:
        raise ValueError(f"{site}: archive differs from validated build")
    print(f"{site}: verified {len(expected)} files")


def main():
    if len(sys.argv) != 3:
        raise SystemExit("usage: verify-release-archives.py APPS_DIR RELEASE_DIR")
    for site in SITES:
        verify(pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2]), site)


if __name__ == "__main__":
    main()
