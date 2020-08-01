#!/bin/bash

sh destroy.sh

docker-compose -f docker-compose.dev.yml build
docker-compose -f docker-compose.dev.yml up -d
