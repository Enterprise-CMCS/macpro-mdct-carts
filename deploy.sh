#!/bin/bash

set -e

# Destroy the entire stack from front to back

sh destroy.sh

# Deploy the entire stack

pushd data
sh deploy.sh
popd

pushd frontend
sh deployDev.sh
popd
