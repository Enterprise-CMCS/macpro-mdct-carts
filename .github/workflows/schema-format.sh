#!/usr/bin/env bash

set -e

cd frontend/api_postgres/utils/section-schemas

echo "Check JSON formatting."
npx prettier --list-different *.json
