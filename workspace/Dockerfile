FROM node:boron

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY webSocketManager.js /usr/src/app/
COPY favicon.ico /usr/src/app/
COPY tux.jpg /usr/src/app/
RUN mkdir -p /usr/src/app/chatNode
COPY server.js /usr/src/app/
ADD chatNode /usr/src/app/chatNode

EXPOSE 8080

CMD [ "npm", "start" ]
