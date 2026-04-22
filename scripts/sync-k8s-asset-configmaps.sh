#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'EOF'
Usage: ./scripts/sync-k8s-asset-configmaps.sh --namespace <namespace> --release <release> --values <values-file> [--chart-dir <k8s-dir>]

Creates or updates the Keycloak theme and client branding asset ConfigMaps expected by the Helm chart.
EOF
}

namespace=""
release=""
values_file=""
chart_dir="k8s"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --namespace)
      namespace=${2:-}
      shift 2
      ;;
    --release)
      release=${2:-}
      shift 2
      ;;
    --values)
      values_file=${2:-}
      shift 2
      ;;
    --chart-dir)
      chart_dir=${2:-}
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

if [[ -z "$namespace" || -z "$release" || -z "$values_file" ]]; then
  usage >&2
  exit 1
fi

if [[ ! -f "$values_file" ]]; then
  echo "Values file not found: $values_file" >&2
  exit 1
fi

if [[ ! -d "$chart_dir/assets" ]]; then
  echo "Assets directory not found: $chart_dir/assets" >&2
  exit 1
fi

trim_quotes() {
  sed -E "s/^[[:space:]]*['\"]?//; s/['\"]?[[:space:]]*$//"
}

read_top_level_value() {
  local key=$1
  sed -n -E "s/^${key}:[[:space:]]*(.*)$/\1/p" "$values_file" | head -n1 | trim_quotes
}

read_nested_value() {
  local section=$1
  local subsection=$2
  local key=$3

  awk -v section="$section" -v subsection="$subsection" -v key="$key" '
    function trim(value) {
      gsub(/^[[:space:]"'"'"']+|[[:space:]"'"'"']+$/, "", value)
      return value
    }

    $0 ~ "^" section ":" { in_section=1; in_subsection=0; next }
    in_section && $0 ~ "^[^ ]" { in_section=0; in_subsection=0 }
    in_section && $0 ~ "^  " subsection ":" { in_subsection=1; next }
    in_subsection && $0 ~ "^  [^ ]" { in_subsection=0 }
    in_subsection && $0 ~ "^    " key ":" {
      sub("^    " key ":[[:space:]]*", "", $0)
      print trim($0)
      exit
    }
  ' "$values_file"
}

resolve_fullname() {
  local fullname_override
  local name_override
  local chart_name="nextgen-eam"

  fullname_override=$(read_top_level_value "fullnameOverride")
  name_override=$(read_top_level_value "nameOverride")

  if [[ -n "$fullname_override" ]]; then
    printf '%s\n' "$fullname_override"
    return
  fi

  local base_name=${name_override:-$chart_name}
  if [[ "$release" == *"$base_name"* ]]; then
    printf '%s\n' "$release"
  else
    printf '%s-%s\n' "$release" "$base_name"
  fi
}

apply_configmap() {
  local configmap_name=$1
  local archive_name=$2
  local archive_path="$chart_dir/assets/$archive_name"

  if [[ ! -f "$archive_path" ]]; then
    echo "Asset archive not found: $archive_path" >&2
    exit 1
  fi

  kubectl create configmap "$configmap_name" \
    -n "$namespace" \
    --from-file="$archive_name=$archive_path" \
    --dry-run=client -o yaml | kubectl apply --server-side --force-conflicts -f -
}

fullname=$(resolve_fullname)

kubectl create namespace "$namespace" --dry-run=client -o yaml | kubectl apply -f - >/dev/null

theme_enabled=$(read_nested_value "keycloak" "theme" "enabled")
theme_configmap=$(read_nested_value "keycloak" "theme" "existingConfigMap")
theme_archive=$(read_nested_value "keycloak" "theme" "archiveFileName")

if [[ "$theme_enabled" == "true" ]]; then
  apply_configmap "${theme_configmap:-${fullname}-keycloak-theme-assets}" "$theme_archive"
fi

branding_enabled=$(read_nested_value "client" "brandingAssets" "enabled")
branding_configmap=$(read_nested_value "client" "brandingAssets" "existingConfigMap")
branding_archive=$(read_nested_value "client" "brandingAssets" "archiveFileName")

if [[ "$branding_enabled" == "true" ]]; then
  apply_configmap "${branding_configmap:-${fullname}-client-branding-assets}" "$branding_archive"
fi

echo "Asset ConfigMaps synced for release '$release' in namespace '$namespace'"