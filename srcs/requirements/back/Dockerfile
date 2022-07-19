FROM node:18

WORKDIR /app
COPY . /app/

RUN apk update && apk add bash
RUN apk --no-cache add --virtual builds-deps build-base python
RUN yarn install
RUN yarn build

EXPOSE 6565
