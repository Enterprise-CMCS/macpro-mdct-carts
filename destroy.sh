#!/bin/bash

set -e

# Destroy the entire stack from front to back

pushd frontend
sh destroy.sh
popd

pushd data
sh destroy.sh
popd
