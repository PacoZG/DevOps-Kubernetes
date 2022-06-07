FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY index.js ./

EXPOSE 5000

CMD ["npm", "start"]