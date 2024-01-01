FROM node:latest

WORKDIR /

COPY package.json .

COPY yarn.lock .

RUN yarn install

RUN yarn global add typescript

COPY . .

RUN tsc

EXPOSE 8080

EXPOSE 3000

CMD ["node","dist/index.js"]

