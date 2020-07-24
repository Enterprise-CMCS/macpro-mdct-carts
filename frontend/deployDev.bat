
docker-compose down
docker-compose -f docker-compose.dev.yml down

docker-compose -f docker-compose.dev.yml build

docker-compose -f docker-compose.dev.yml up -d
