#!/usr/bin/env bash
# Download the official YesLogic Prince AWS Lambda zip, verify the pinned SHA-256,
# and upload it once to the account prerequisites bucket.
# Note that if you want to download and publish a new version, PRINCE_ASSET_META in
# deployment/utils/prince-asset.ts must be updated first.
#
# Prerequisites:
#   - Cloudtamer temp creds for the target AWS account
#   - Bucket already created (deploy prerequisites stack)
#
# Usage:
#   PROJECT=carts ./scripts/publish-prince-asset.sh
#   PROJECT=carts AWS_ACCOUNT_ID=123456789012 ./scripts/publish-prince-asset.sh   <- Ensure you replace with dev/val/main aws account ID
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PROJECT="${PROJECT:-carts}"

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

AWS_ACCOUNT_ID="${AWS_ACCOUNT_ID:-$(aws sts get-caller-identity --query Account --output text)}"
BUCKET="${PROJECT}-prince-assets-${AWS_ACCOUNT_ID}"
KEY="prince/${PRINCE_VERSION}/prince-${PRINCE_VERSION}-aws-lambda.zip"

TMP_DIR="$(mktemp -d "${TMPDIR:-/tmp}/prince-publish-XXXXXX")"
cleanup() {
  rm -rf "${TMP_DIR}"
}
trap cleanup EXIT

ZIP_PATH="${TMP_DIR}/prince-aws-lambda.zip"
echo "++ Downloading ${DOWNLOAD_URL}"
curl -fsSL -o "${ZIP_PATH}" "${DOWNLOAD_URL}"

ACTUAL_SHA256="$(shasum -a 256 "${ZIP_PATH}" | awk '{ print $1 }')"
if [[ "${ACTUAL_SHA256}" != "${EXPECTED_SHA256}" ]]; then
  echo "error: Prince zip SHA-256 mismatch; refusing to upload" >&2
  echo "  expected: ${EXPECTED_SHA256}" >&2
  echo "  actual:   ${ACTUAL_SHA256}" >&2
  exit 1
fi
echo "-- SHA-256 OK (${ACTUAL_SHA256})"

echo "++ Uploading s3://${BUCKET}/${KEY}"
aws s3 cp "${ZIP_PATH}" "s3://${BUCKET}/${KEY}" \
  --region "${AWS_DEFAULT_REGION:-us-east-1}"

echo "-- OK: published Prince ${PRINCE_VERSION} to s3://${BUCKET}/${KEY}"
