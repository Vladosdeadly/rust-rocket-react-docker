FROM node:16-buster AS builder
WORKDIR /usr/src/front_client

COPY . .
COPY package.json ./
RUN yarn install && yarn build


FROM node:16-alpine
WORKDIR /usr/src/front_client
COPY --from=builder /usr/src/front_client .

EXPOSE 3000

CMD [ "yarn", "start" ]

