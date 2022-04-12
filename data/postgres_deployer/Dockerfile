# ==============================================================================
# => psql deployment container
FROM postgres:12.8 as deployer

WORKDIR /app

RUN apt-get update && apt-get install -y netcat

COPY . .

RUN chmod +x *

ENTRYPOINT ["./entrypoint.sh"]
