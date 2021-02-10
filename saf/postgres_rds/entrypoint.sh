#!/bin/bash

set +e

envsubst < overlay_attributes.yml > overlay_attributes_subd.yml
mkdir profiles
cd profiles
git clone https://github.com/mitre/aws-rds-crunchy-data-postgresql-9-stig-baseline.git
git clone https://github.com/CMSgov/cms-ars-3.1-moderate-aws-rds-crunchy-data-postgresql-9-stig-overlay.git
cd cms-ars-3.1-moderate-aws-rds-crunchy-data-postgresql-9-stig-overlay
bundle install
cd ..
inspec exec cms-ars-3.1-moderate-aws-rds-crunchy-data-postgresql-9-stig-overlay --attrs=../overlay_attributes_subd.yml --reporter=cli json:output.json
echo "BEGIN_JSON_RESULTS"
cat output.json
echo "END_JSON_RESULTS"
