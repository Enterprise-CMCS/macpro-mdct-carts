#!/usr/bin/env bash

set -e

cd frontend/api_postgres/utils/section-schemas

echo "Check JSON formatting."
prettier --list-different *.json
