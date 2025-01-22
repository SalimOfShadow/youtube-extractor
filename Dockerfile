FROM node:23-alpine3.20

WORKDIR /app

COPY . .

COPY .env .env

COPY ./src/keys ./keys

RUN npm install

RUN npm run build

EXPOSE 9300

CMD ["npm","run","start"]