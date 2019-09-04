FROM node:alpine
RUN mkdir -p /usr/src/app/public
RUN mkdir -p /var/run
WORKDIR /usr/src/app
COPY . .
RUN yarn
RUN yarn build
VOLUME /var/run/docker.sock
EXPOSE 3005
CMD yarn start