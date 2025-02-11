FROM node:23.7-alpine

RUN apk add --no-cache git

WORKDIR /app

COPY dist .

CMD ["node", "index.js"]
