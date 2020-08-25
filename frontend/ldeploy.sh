#!/bin/bash

sh destroy.sh

docker-compose -f docker-compose.dev.yml up
# sh local-additional.sh
