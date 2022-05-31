FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY index.js /usr/src/app/

EXPOSE 3001

CMD ["npm", "start"]