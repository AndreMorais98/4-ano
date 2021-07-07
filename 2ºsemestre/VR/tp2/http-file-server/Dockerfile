FROM node:14

# Create app directory
WORKDIR /usr/tp2/http-file-server

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "node", "./bin/http-server", "../http-file-server/home/server/"]
