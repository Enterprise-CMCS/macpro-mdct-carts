#!/bin/bash

set -e

docker run --rm --network="data_net" --name test -e APPLICATION_ENDPOINT=http://ui -v $(pwd)/testcafe:/tests testcafe/testcafe chromium /tests/**/*.js
