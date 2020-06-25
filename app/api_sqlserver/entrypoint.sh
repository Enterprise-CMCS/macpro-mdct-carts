#!/bin/sh

if [ "$DATABASE" = "sqlserver" ]
then
    echo "Waiting for sqlserver..."
    
    while ! nc -z $SQLSERVER_HOST 1433; do
      sleep 0.1
    done

    echo "sqlserver started"
fi

exec "$@"
