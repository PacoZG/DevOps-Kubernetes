FROM node:alpine

WORKDIR /usr/src/app

COPY package* ./

RUN npm ci

COPY . .

ENV PORT 3001

CMD ["npm", "run", "server"]