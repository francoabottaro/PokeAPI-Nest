FROM node:20

WORKDIR /usr/src/app

COPY yarn.lock package.json ./

RUN yarn install 

COPY . .

EXPOSE 3000

CMD ["yarn", "start:dev"]