# ==============================================================================
# => Dev container
FROM node:14.4.0 as dev

# Set working directory
WORKDIR /app

# Start up sequence for the dev container
CMD ["/bin/bash", "-c", "npm install && ./env.sh && cp ./env-config.js ./public/ && npm run start"]


# ==============================================================================
# => Build container
FROM dev as builder

#install aws cli

RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" &&\
        unzip awscliv2.zip &&\
        ./aws/install


# Copy package.json and package-lock.json
COPY package*.json ./





# Install modules from the package-lock.json
RUN npm ci

# Copy source code
COPY . .

# Create static build
RUN npm run build

#===============================================================================
#copy static files to s3

# RUN aws s3 cp /app/build s3://carts-ui-cloudfrontorigin --recursive

# RUN aws s3 cp /app/build s3://cartsui-cloudfront-origin --recursive



COPY ./s3sync.sh /

RUN chmod +x /s3sync.sh

#ENTRYPOINT ["/s3sync.sh"]

CMD ["/bin/bash", "-c", "/s3sync.sh"]

#CMD ["s3", "sync", "/app/build", "s3://cartsui-cloudfront-origin"]

# ==============================================================================
# => Run container
FROM nginx:1.19.0-alpine as runner
#FROM alpine:latest
# Copy nginx config
##RUN rm -rf /etc/nginx/conf.d
##COPY conf /etc/nginx

# Copy static build from the builder container
COPY --from=builder /app/build /app/build



#COPY s3sync.sh /usr/local/bin/s3sync.sh
#RUN chmod +x /usr/local/bin/s3sync.sh
#CMD ["s3sync.sh"]



COPY ./s3sync.sh /

RUN chmod +x /s3sync.sh


#ENTRYPOINT ["/s3sync.sh"]

#CMD ["/bin/bash", "-c", "/s3sync.sh"]


CMD ["/bin/bash", "-c", "/s3sync.sh"]



# Expose port 80 for nginx
##EXPOSE 80

# Copy .env file and shell script to container; this sets runtime variables
##WORKDIR /usr/share/nginx/html
##COPY ./env.sh .
##COPY .env .

# Add bash to image, so env.sh can be run
##RUN apk add --no-cache bash

# Make env.sh executable
##RUN chmod +x env.sh

# Start Nginx server; env.sh is run first, setting runtime variables on boot
#CMD ["/bin/bash", "-c", "/usr/share/nginx/html/env.sh && nginx -g \"daemon off;\""]
