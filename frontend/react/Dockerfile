# ==============================================================================
# => Dev container
FROM node:14.4.0 as dev

# Set working directory
WORKDIR /app

# Start up sequence for the dev container
CMD ["/bin/bash", "-c", "npm install && ./env.sh && cp ./env-config.js ./public/ && npm run start"]


# ==============================================================================
