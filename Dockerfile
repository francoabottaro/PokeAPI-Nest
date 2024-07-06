FROM node:22

WORKDIR /usr/src/app

COPY . .

RUN npm install --global yarn

RUN yarn install

CMD ["yarn", "start:dev"]