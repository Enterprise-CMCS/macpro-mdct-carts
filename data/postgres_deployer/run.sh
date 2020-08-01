echo "Waiting for postgres..."

while ! nc -z $POSTGRES_HOST 5432; do
  sleep 0.1
done

echo "PostgreSQL started"

PGPASSWORD=$POSTGRES_PASSWORD psql -d $POSTGRES_DB -h $POSTGRES_HOST -U $POSTGRES_USER -p 5432 -f dbScript.sql -w
