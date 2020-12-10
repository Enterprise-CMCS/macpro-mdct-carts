#!/bin/bash
sh destroy.sh
docker system prune -a -f
docker network create data_net
sh deployDev.sh