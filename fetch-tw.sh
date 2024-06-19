#!/bin/sh
set -ex

remove_if_directory_exists() {
	if [ -d "$1" ]; then rm -Rf "$1"; fi
}

BRANCH="master";

REPOSITORY='https://github.com/tradingview/charting_library/'

LATEST_HASH=$(git ls-remote $REPOSITORY $BRANCH | grep -Eo '^[[:alnum:]]+')

remove_if_directory_exists "$LATEST_HASH"

git clone -q --depth 1 -b "$BRANCH" $REPOSITORY "$LATEST_HASH"

COMPONENT_DIR=src/modules/shared/AdvancedChart

# remove_if_directory_exists "public/datafeeds"
remove_if_directory_exists "public/charting_library"
remove_if_directory_exists "$COMPONENT_DIR/charting_library"

# cp -r "$LATEST_HASH/datafeeds" public
cp -r "$LATEST_HASH/charting_library" public
cp -r "$LATEST_HASH/charting_library" $COMPONENT_DIR

remove_if_directory_exists "$LATEST_HASH"
