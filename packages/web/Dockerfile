FROM node:10-alpine
# Install system deps
RUN apk update && apk upgrade && \
  apk add --no-cache git openssh
# Create app directory
WORKDIR /home/app

# Dependencies
COPY package.json /home/app/
COPY yarn.lock /home/app/
COPY lerna.json /home/app/

COPY packages/common/package.json /home/app/packages/common/

COPY packages/web/package.json /home/app/packages/web/

RUN yarn
RUN yarn bootstrap

# Copy app
COPY packages/web/ /home/app/packages/web/
COPY packages/common/ /home/app/packages/common/

# Bundle app source
ENV NODE_ENV=production
RUN yarn --cwd=packages/web build

# Start prod app
EXPOSE 3000
CMD yarn --cwd=packages/web start