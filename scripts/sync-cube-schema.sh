#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC_DIR="$ROOT_DIR/analytics/cube"
DST_DIR="$ROOT_DIR/k8s/files/cube"

rm -rf "$DST_DIR"
mkdir -p "$DST_DIR/model"

cp "$SRC_DIR/cube.js" "$DST_DIR/cube.js"

find "$SRC_DIR/model" -maxdepth 1 -type f \( -name '*.js' -o -name '*.yml' -o -name '*.yaml' \) \
	-exec cp {} "$DST_DIR/model/" \;

echo "Synced Cube schema from $SRC_DIR to $DST_DIR"