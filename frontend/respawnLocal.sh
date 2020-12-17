#!/bin/bash
sh destroy.sh
sh destroyDev.sh
docker system prune -a -f
docker network create data_net
sh deployLocal.sh