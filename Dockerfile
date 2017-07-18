FROM node:7.9.0-alpine
MAINTAINER Lukasz Gornicki <derberg@wp.pl>
# add bash and git
RUN apk update && apk add --no-cache git openssh nano && \
    rm -rf /var/lib/apt/lists/* && \
    rm /var/cache/apk/*
# set what needs to be included in the image
COPY . /docpad-skeleton-apidocs/
WORKDIR /docpad-skeleton-apidocs
# install dependencies of the skeleton
RUN npm run prepare
# initialize your skeleton with sample data
RUN npm run init

EXPOSE 9778

CMD ["sh"]
