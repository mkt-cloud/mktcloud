FROM node:alpine
RUN apk add --no-cache ffmpeg
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json ./
RUN mkdir -p /tmp/stream
VOLUME [ "/tmp/stream" ]
CMD yarn start