FROM node:alpine

WORKDIR /

COPY package.json .

COPY yarn.lock .

RUN yarn install

# RUN yarn global add pm2

RUN yarn global add typescript

RUN yarn global add pm2

COPY . .

RUN tsc

EXPOSE 8080

CMD ["pm2-runtime", "start", "dist/index.js"]


