#!/usr/bin/env python3
"""Validate a downloaded five-site CI artifact before any release upload."""
import hashlib
import pathlib
import re
import sys
import tarfile

SITES = ("squarecampus", "fairhelm", "blogs", "legal", "press")


def check(release, expected_commit):
    if not re.fullmatch(r"[0-9a-f]{40}", expected_commit):
        raise ValueError("Expected a full lowercase commit SHA")
    for metadata in ("COMMIT", "SHA256SUMS"):
        if (release / metadata).is_symlink() or not (release / metadata).is_file():
            raise ValueError(f"Unsafe or missing {metadata}")
    if (release / "COMMIT").read_text(encoding="ascii") != expected_commit + "\n":
        raise ValueError("Artifact commit does not match the selected workflow commit")
    expected_names = {f"{site}.tar" for site in SITES}
    checksums = {}
    for line in (release / "SHA256SUMS").read_text(encoding="ascii").splitlines():
        match = re.fullmatch(r"([0-9a-f]{64})  ([a-z]+\.tar)", line)
        if not match or match[2] not in expected_names or match[2] in checksums:
            raise ValueError("Invalid or duplicate checksum entry")
        checksums[match[2]] = match[1]
    if set(checksums) != expected_names:
        raise ValueError("Artifact must contain checksums for exactly five sites")
    for name, expected in checksums.items():
        path = release / name
        if path.is_symlink() or not path.is_file():
            raise ValueError(f"{name}: missing or unsafe archive")
        sha = hashlib.sha256()
        with path.open("rb") as stream:
            for block in iter(lambda: stream.read(1024 * 1024), b""):
                sha.update(block)
        if sha.hexdigest() != expected:
            raise ValueError(f"{name}: checksum mismatch")
        seen = set()
        index_found = False
        with tarfile.open(path, "r:") as archive:
            for member in archive:
                value = member.name.removeprefix("./")
                if member.isdir() and value in ("", "."):
                    continue
                parts = value.split("/")
                if value.startswith("/") or any(part in ("", ".", "..") for part in parts) or not (member.isfile() or member.isdir()):
                    raise ValueError(f"{name}: unsafe archive entry")
                if value in seen:
                    raise ValueError(f"{name}: duplicate archive entry")
                seen.add(value)
                if value == "index.html" and member.isfile():
                    index_found = True
            if not index_found:
                raise ValueError(f"{name}: missing index.html")
    print(f"Verified five release archives for {expected_commit}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit("usage: check-release-artifact.py RELEASE_DIR EXPECTED_COMMIT")
    check(pathlib.Path(sys.argv[1]), sys.argv[2])
