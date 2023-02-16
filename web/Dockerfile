FROM node:16-alpine

WORKDIR /web

COPY package*.json ./

RUN npm install

COPY ./ ./

CMD ["npm", "start"]

