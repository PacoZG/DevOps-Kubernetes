FROM node:16-alpine

WORKDIR /usr/src/app

COPY package* ./

RUN npm install --quiet

EXPOSE 3001

COPY . .

CMD ["npm", "run", "server"]