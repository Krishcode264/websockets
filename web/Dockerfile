FROM node:latest

WORKDIR /

COPY package.json .

COPY yarn.lock .

RUN yarn install

COPY  . .

EXPOSE 3001
EXPOSE 3000

RUN yarn build

CMD [ "yarn" , "start" ]