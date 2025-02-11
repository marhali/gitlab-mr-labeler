FROM node:22.13.1-alpine

RUN apk add --no-cache git

WORKDIR /app

COPY dist .

CMD ["node", "index.js"]
