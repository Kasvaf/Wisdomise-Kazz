#!/bin/bash
set -e

git commit --amend --no-edit
git checkout stage
git reset --hard redsign
git push -f
git checkout redsign
git push -f
