#!/bin/bash

sh destroy.sh

docker-compose build

docker-compose up -d
