FROM node:14

# Create app directory
WORKDIR /usr/tp2/auth_server

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

EXPOSE 7777
CMD [ "node", "./bin/www" ]