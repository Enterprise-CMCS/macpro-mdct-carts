#!/usr/bin/env bash
# Fetch a macOS PrinceXML distribution into services/app-api/bin/prince-arm64
# for Ministack/AWS emulation on Apple Silicon. Does not touch bin/prince/ (Linux AWS package).
#
# Currently unused by LocalStack (which uses fetch-prince-linux.sh); kept for the
# upcoming ministack conversion.
#
# Uses a temporary npm install of the "prince" package (outside this repo's Yarn
# enableScripts:false) so the native macOS binary can be downloaded.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEST_DIR="${REPO_ROOT}/services/app-api/bin/prince-arm64"
PRINCE_NPM_VERSION="${PRINCE_NPM_VERSION:-1.14.8}"

if [[ "$(uname -s)" != "Darwin" ]]; then
  echo "error: fetch-prince-macos.sh only supports macOS (got $(uname -s))" >&2
  exit 1
fi

if [[ "$(uname -m)" != "arm64" ]]; then
  echo "warning: expected Apple Silicon (arm64); got $(uname -m). Continuing anyway." >&2
fi

TMP_DIR="$(mktemp -d "${TMPDIR:-/tmp}/prince-macos-XXXXXX")"
cleanup() {
  rm -rf "${TMP_DIR}"
}
trap cleanup EXIT

echo "++ Installing npm package prince@${PRINCE_NPM_VERSION} in ${TMP_DIR}"
(
  cd "${TMP_DIR}"
  npm install --silent "prince@${PRINCE_NPM_VERSION}"
  # prince-npm.js skips download if a global prince(1) is on PATH (e.g. Homebrew).
  # Force a local unpack by hiding other bins during the install script.
  if [[ ! -x "node_modules/prince/prince/lib/prince/bin/prince" ]]; then
    echo "++ Running prince-npm.js install to download macOS Prince"
    NODE_BIN="$(dirname "$(command -v node)")"
    (
      cd node_modules/prince
      # Keep node on PATH; hide Homebrew/other prince(1) so the script downloads locally.
      PATH="${NODE_BIN}:/usr/bin:/bin" node prince-npm.js install
    )
  fi
)

SRC_PRINCE_DIR="${TMP_DIR}/node_modules/prince/prince"
BINARY="${SRC_PRINCE_DIR}/lib/prince/bin/prince"
if [[ ! -f "${BINARY}" ]]; then
  echo "error: expected binary missing at ${BINARY}" >&2
  ls -laR "${TMP_DIR}/node_modules/prince" 2>/dev/null | head -80 >&2 || true
  exit 1
fi

echo "++ Staging into ${DEST_DIR}"
rm -rf "${DEST_DIR}"
mkdir -p "${DEST_DIR}"
# npm macOS layout: prince/lib/prince/...
cp -R "${SRC_PRINCE_DIR}/." "${DEST_DIR}/"

# SBOM hashes trip detect-secrets; not needed at runtime.
find "${DEST_DIR}" -name '*.cdx.json' -delete

# Same runtime interface as the AWS Lambda package: ./prince at package root.
cat > "${DEST_DIR}/prince" <<'EOF'
#! /bin/sh
basedir=$(dirname "$0")
prefix="${basedir}/lib/prince"
exec "${prefix}/bin/prince" --prefix="${prefix}" "$@"
EOF

chmod +x "${DEST_DIR}/prince" "${DEST_DIR}/lib/prince/bin/prince"

echo "++ Verifying"
"${DEST_DIR}/prince" --version
echo "-- OK: macOS Prince ready at ${DEST_DIR}"
