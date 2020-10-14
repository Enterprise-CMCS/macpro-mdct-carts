# ==============================================================================
# => psql deployment container
FROM postgres:9.6.9 as deployer

WORKDIR /app

RUN apt-get update && apt-get install -y netcat

COPY . .

RUN chmod +x *

ENTRYPOINT ["./entrypoint.sh"]
