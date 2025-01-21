FROM node:23-alpine3.20

WORKDIR /app

COPY . .

COPY .env .env

RUN npm install

RUN npm run build

EXPOSE 9300

CMD ["npm","run","start"]