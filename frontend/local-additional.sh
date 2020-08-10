# docker-compose -f docker-compose.dev.yml run api_postgres sh -c "python manage.py makemigrations && python manage.py migrate"
docker-compose -f docker-compose.dev.yml run api_postgres sh -c "python manage.py makemigrations && python manage.py migrate && python manage.py generate_fixtures"
# docker-compose -f docker-compose.dev.yml run api_postgres sh -c "python manage.py makemigrations && python manage.py migrate &&  python manage.py loaddata fixtures/sections.json"
#docker-compose -f docker-compose.dev.yml run api_postgres sh -c "python manage.py makemigrations && python manage.py migrate && python manage.py createsuperuser --username admin --email test@test.com && python manage.py loaddata fixtures/sections.json"
#docker-compose -f docker-compose.dev.yml run api_postgres python manage.py createsuperuser --username admin --email test@test.com
#docker-compose -f docker-compose.dev.yml run api_postgres python manage.py loaddata 
#docker-compose -f docker-compose.dev.yml run api_postgres python manage.py changepassword admin
