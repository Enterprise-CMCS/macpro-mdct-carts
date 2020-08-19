# ==============================================================================
# => chef inspec image
FROM chef/inspec as inspector

RUN apk add --no-cache make gcc libc-dev postgresql-client gettext


COPY entrypoint.sh overlay_attributes.yml ./


ENTRYPOINT ["sh", "entrypoint.sh"]
