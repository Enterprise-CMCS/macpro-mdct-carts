#!/bin/bash

sh destroy.sh

docker-compose build

# depends_on specifications in compose control start order, but containers do not wait for a 'ready' state.
# more here:  https://docs.docker.com/compose/startup-order/
# The current Django container does not retry it's db connection.  If the db conn fails, it's toast.
# The most appropriate course of action is probably to add retry capability to Django.
# Since compose is only used locally, I'm OK with the ugly sleep work around *for now*
docker-compose up -d db
sleep 2
docker-compose up -d
