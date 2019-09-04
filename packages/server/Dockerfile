FROM node:10-alpine
# Install system deps
RUN apk update && apk upgrade && \
  apk add --no-cache git openssh
RUN mkdir -p ~/.ssh/
RUN ssh-keyscan -t rsa github.com > ~/.ssh/known_hosts
RUN mkdir -p /usr/src
COPY deploykey-common /usr/src
RUN mv /usr/src/deploykey-common ~/.ssh/id_rsa
RUN chmod 600 ~/.ssh/id_rsa
# Create app directory
RUN mkdir -p /usr/src/app 
WORKDIR /usr/src/app
# Install app dependencies
COPY . /usr/src/app
RUN yarn
# Bundle app source
ENV NODE_ENV="production"
RUN yarn build

# Start prod app
EXPOSE 4000
CMD yarn start