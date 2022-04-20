# ==============================================================================
# => psql deployment container
FROM postgres:12.8 as bootstrapper

WORKDIR /app

RUN apt-get update && apt-get install -y netcat gettext

COPY . .

RUN chmod +x *

ENTRYPOINT ["./entrypoint.sh"]
