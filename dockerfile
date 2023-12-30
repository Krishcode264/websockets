FROM node:20
 
WORKDIR /usr/src/app
 
# Copy root package.json and lockfile
COPY package.json ./

COPY yarn.lock  ./

COPY packages/ packages/

RUN yarn install
 
# Copy the docs package.json
COPY apps/web/package.json ./apps/web/package.json
 
RUN cd apps/web && yarn install
 
# Copy app source
COPY . .
 
EXPOSE 3000

RUN cd apps/socket && yarn install

RUN yarn build
 
CMD [ "yarn", "dev" ]