FROM node:7.9.0-alpine
MAINTAINER Team Wookiee <team-wookiee@sap.com>
# add bash and git
RUN apk update && apk add --no-cache git openssh && \
    rm -rf /var/lib/apt/lists/* && \
    rm /var/cache/apk/*
# set what needs to be included in the image
COPY . /docpad-skeleton-apidocs/
WORKDIR /docpad-skeleton-apidocs
# install dependencies of the skeleton
RUN npm run prepare

EXPOSE 9778

CMD ["sh", "docker_start.sh"]
