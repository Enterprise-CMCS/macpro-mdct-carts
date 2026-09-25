#!/usr/bin/env bash
# Fetch the official YesLogic Prince AWS Lambda package into
# services/app-api/bin/prince/ (gitignored) for LocalStack printPdf bundling.
# Verifies SHA-256 against deployment/utils/prince-asset.ts.
#
# Does not touch bin/prince-arm64/ (see fetch-prince-macos.sh).
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEST_DIR="${REPO_ROOT}/services/app-api/bin/prince"

read_meta() {
  (cd "${REPO_ROOT}" && node --import tsx -e "
    import { loadPrinceAssetMeta } from './deployment/utils/prince-asset.ts';
    const m = loadPrinceAssetMeta();
    console.log(m[process.argv[1]]);
  " "$1")
}

PRINCE_VERSION="$(read_meta version)"
EXPECTED_SHA256="$(read_meta sha256)"
DOWNLOAD_URL="${PRINCE_DOWNLOAD_URL:-$(read_meta url)}"

TMP_DIR="$(mktemp -d "${TMPDIR:-/tmp}/prince-linux-XXXXXX")"
cleanup() {
  rm -rf "${TMP_DIR}"
}
trap cleanup EXIT

ZIP_PATH="${TMP_DIR}/prince-aws-lambda.zip"
echo "++ Downloading ${DOWNLOAD_URL}"
curl -fsSL -o "${ZIP_PATH}" "${DOWNLOAD_URL}"

ACTUAL_SHA256="$(shasum -a 256 "${ZIP_PATH}" | awk '{ print $1 }')"
if [[ "${ACTUAL_SHA256}" != "${EXPECTED_SHA256}" ]]; then
  echo "error: Prince zip SHA-256 mismatch" >&2
  echo "  expected: ${EXPECTED_SHA256}" >&2
  echo "  actual:   ${ACTUAL_SHA256}" >&2
  exit 1
fi
echo "-- SHA-256 OK (${ACTUAL_SHA256})"

echo "++ Unpacking"
unzip -q "${ZIP_PATH}" -d "${TMP_DIR}/unpacked"

# Zip contents are at the archive root (prince, prince-engine/, lib/, …).
SRC_DIR="${TMP_DIR}/unpacked"
if [[ ! -f "${SRC_DIR}/prince" ]]; then
  # Tolerate a single top-level directory wrapper if YesLogic changes layout.
  candidates=("${SRC_DIR}"/*)
  if [[ ${#candidates[@]} -eq 1 && -d "${candidates[0]}" && -f "${candidates[0]}/prince" ]]; then
    SRC_DIR="${candidates[0]}"
  fi
fi

if [[ ! -f "${SRC_DIR}/prince" ]]; then
  echo "error: expected ./prince wrapper missing after unpack" >&2
  ls -la "${TMP_DIR}/unpacked" >&2 || true
  exit 1
fi

# Prince 16+ uses prince-engine/bin/prince.${arch}; older packages used bin/prince.
if [[ ! -d "${SRC_DIR}/prince-engine/bin" ]]; then
  echo "error: expected prince-engine/bin missing after unpack" >&2
  exit 1
fi
if ! compgen -G "${SRC_DIR}/prince-engine/bin/prince*" >/dev/null; then
  echo "error: expected prince-engine/bin/prince* binary missing after unpack" >&2
  ls -la "${SRC_DIR}/prince-engine/bin" >&2 || true
  exit 1
fi

if [[ ! -f "${SRC_DIR}/prince-engine/license/license.dat" ]]; then
  echo "error: expected demo license missing at prince-engine/license/license.dat" >&2
  exit 1
fi

echo "++ Staging into ${DEST_DIR}"
rm -rf "${DEST_DIR}"
mkdir -p "${DEST_DIR}"
cp -R "${SRC_DIR}/." "${DEST_DIR}/"
chmod +x "${DEST_DIR}/prince"
chmod +x "${DEST_DIR}/prince-engine/bin"/prince* 2>/dev/null || true

# SBOM hashes trip detect-secrets; not needed at runtime.
find "${DEST_DIR}" -name '*.cdx.json' -delete

echo "++ Verifying package layout"
test -x "${DEST_DIR}/prince"
test -f "${DEST_DIR}/prince-engine/license/license.dat"
echo "-- OK: Linux AWS Lambda Prince ${PRINCE_VERSION} ready at ${DEST_DIR}"
echo "   (Cannot --version on macOS; binary is Linux ELF for Lambda.)"
ls -la "${DEST_DIR}/prince-engine/bin"/prince*
