#!/usr/bin/env python3
"""Validate the marketing publication environment and protected current main."""
import json
import re
import sys


def check(environment, branch, commit):
    if not isinstance(commit, str) or not re.fullmatch(r'[0-9a-f]{40}', commit):
        raise ValueError('Invalid commit')
    if not isinstance(environment, dict) or not isinstance(branch, dict):
        raise ValueError('Invalid GitHub policy response')
    policy = environment.get('deployment_branch_policy') or {}
    rules = environment.get('protection_rules')
    if (environment.get('name') != 'azure-marketing-publication'
            or environment.get('can_admins_bypass') is not False
            or policy.get('protected_branches') is not True
            or policy.get('custom_branch_policies') is not False
            or not isinstance(rules, list) or len(rules) != 1
            or not isinstance(rules[0], dict) or rules[0].get('type') != 'branch_policy'):
        raise ValueError('Marketing publication environment is not protected as required')
    if branch.get('protected') is not True or (branch.get('commit') or {}).get('sha') != commit:
        raise ValueError('Producer is not current protected main')


if __name__ == '__main__':
    if len(sys.argv) != 4:
        raise SystemExit('usage: verify-azure-stage-context.py ENVIRONMENT_JSON BRANCH_JSON COMMIT')
    try:
        with open(sys.argv[1]) as file: environment = json.load(file)
        with open(sys.argv[2]) as file: branch = json.load(file)
        check(environment, branch, sys.argv[3])
    except (ValueError, OSError, TypeError, AttributeError) as exc:
        print(f'Marketing stage context rejected: {exc}', file=sys.stderr); sys.exit(1)
