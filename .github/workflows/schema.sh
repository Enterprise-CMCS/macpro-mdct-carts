#!/usr/bin/env bash

set -e

for f in $(ls *-section-*.json)
do
  echo "Checking ${f}"
  jsonschema -i "$f" "./backend-section.schema.json"
  python validate_ids.py -i "$f" -c
  echo "✓ ${f} is fine"
done
