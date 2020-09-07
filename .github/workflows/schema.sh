#!/usr/bin/env bash

set -e

cd docs/section-schemas

for f in $(ls *-section-*.json)
do
  echo "Checking ${f}"
  jsonschema -i "$f" "backend-section.schema.json"
  python validate_ids.py -i "$f" -c
  echo "✓ ${f} is fine"
done
