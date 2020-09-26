#!/usr/bin/env bash

set -e

cd docs/section-schemas

echo "Generating fixtures."
python generate_fixtures.py
echo "Comparing JSON files in docs/section-schemas to contents of fixtures."
python compare_fixtures.py

for f in $(ls *-section-*.json)
do
  echo "Checking ${f}"
  jsonschema -i "$f" "backend-section.schema.json"
  python validate_ids.py -i "$f" -c
  echo "✓ ${f} is fine"
done
