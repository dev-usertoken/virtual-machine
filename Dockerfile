FROM node:8.6.0-alpine

# Set a working directory
WORKDIR /usr/src/app

COPY ./build-done/package.json .
COPY ./build-done/yarn.lock .

# Install Node.js dependencies
RUN yarn install --production --no-progress

# Copy application files
COPY ./build-done .

# Run the container under "node" user by default
USER node

CMD [ "yarn", "start" ]
