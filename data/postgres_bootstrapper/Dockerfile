# ==============================================================================
# => psql deployment container
FROM postgres:9.6.9 as bootstrapper

WORKDIR /app

RUN apt-get update && apt-get install -y netcat gettext

COPY . .

RUN chmod +x *

ENTRYPOINT ["./entrypoint.sh"]
