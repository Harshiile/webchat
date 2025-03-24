FROM node:23-alpine

WORKDIR /usr/app

COPY package*.json .

RUN npm install

COPY . .

RUN npx tsc

EXPOSE 3000

CMD ["node","dist/index.js"]

