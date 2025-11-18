#!/bin/bash

# Script to manage versions across the project
# Usage:
#   ./scripts/version.sh         - Show current version
#   ./scripts/version.sh patch   - Increment patch version (1.0.0 -> 1.0.1)
#   ./scripts/version.sh minor   - Increment minor version (1.0.0 -> 1.1.0)
#   ./scripts/version.sh major   - Increment major version (1.0.0 -> 2.0.0)
#   ./scripts/version.sh set X.Y.Z - Set specific version

set -e

VERSION_FILE="VERSION"
ROOT_PACKAGE_JSON="package.json"
CLIENT_PACKAGE_JSON="client/package.json"
SERVER_PACKAGE_JSON="server/package.json"

# Get current version
get_current_version() {
    if [ -f "$VERSION_FILE" ]; then
        cat "$VERSION_FILE"
    else
        echo "0.0.0"
    fi
}

# Parse version
parse_version() {
    local version=$1
    echo "$version" | sed -E 's/([0-9]+)\.([0-9]+)\.([0-9]+)/\1 \2 \3/'
}

# Increment version
increment_version() {
    local current=$1
    local type=$2
    
    read -r major minor patch <<< "$(parse_version "$current")"
    
    case $type in
        major)
            major=$((major + 1))
            minor=0
            patch=0
            ;;
        minor)
            minor=$((minor + 1))
            patch=0
            ;;
        patch)
            patch=$((patch + 1))
            ;;
    esac
    
    echo "${major}.${minor}.${patch}"
}

# Update version in file
update_version_in_file() {
    local file=$1
    local version=$2
    
    if [[ "$file" == *.json ]]; then
        # Update package.json files
        if command -v jq &> /dev/null; then
            tmp=$(mktemp)
            jq --arg ver "$version" '.version = $ver' "$file" > "$tmp" && mv "$tmp" "$file"
        else
            # Fallback without jq
            sed -i "s/\"version\": \".*\"/\"version\": \"$version\"/" "$file"
        fi
    else
        # Update VERSION file
        echo "$version" > "$file"
    fi
}

# Main logic
current_version=$(get_current_version)

if [ $# -eq 0 ]; then
    # No arguments - just show current version
    echo "Current version: $current_version"
    exit 0
fi

case $1 in
    patch|minor|major)
        new_version=$(increment_version "$current_version" "$1")
        ;;
    set)
        if [ -z "$2" ]; then
            echo "Error: Please provide version number (e.g., ./scripts/version.sh set 1.2.3)"
            exit 1
        fi
        new_version=$2
        ;;
    *)
        echo "Usage: $0 [patch|minor|major|set X.Y.Z]"
        exit 1
        ;;
esac

echo "Updating version from $current_version to $new_version"

# Update all version files
update_version_in_file "$VERSION_FILE" "$new_version"
update_version_in_file "$ROOT_PACKAGE_JSON" "$new_version"
update_version_in_file "$CLIENT_PACKAGE_JSON" "$new_version"
update_version_in_file "$SERVER_PACKAGE_JSON" "$new_version"

echo "✓ Version updated to $new_version"
echo ""
echo "Don't forget to:"
echo "  1. Commit the changes: git add VERSION package.json client/package.json server/package.json"
echo "  2. Create a git tag: git tag -a v$new_version -m 'Release v$new_version'"
echo "  3. Push with tags: git push --follow-tags"
