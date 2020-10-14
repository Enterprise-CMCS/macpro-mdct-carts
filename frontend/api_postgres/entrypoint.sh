#!/bin/sh

if [ "$DATABASE" = "postgres" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $POSTGRES_HOST 5432; do
      sleep 0.1
    done

    echo "PostgreSQL started"
fi

python utils/section-schemas/generate_fixtures.py
python utils/section-schemas/compare_fixtures.py
python manage.py makemigrations && python manage.py migrate && python manage.py idempotent_fixtures --overwrite && python manage.py add_state_permissions

exec "$@"
