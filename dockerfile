FROM node:20
 
WORKDIR /usr/src/app
 
# Copy root package.json and lockfile
COPY package.json ./

COPY yarn.lock  ./

COPY /apps/socket/package.json ./socket/package.json

RUN yarn install

COPY /apps/socket  ./socket

RUN cd socket && yarn add -D typescript

RUN cd socket && yarn build

CMD [ "node","socket/index.js" ]
 


