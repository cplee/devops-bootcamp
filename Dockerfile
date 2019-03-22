FROM node:8.15-alpine

RUN apk add --no-cache tini
ENTRYPOINT ["/sbin/tini", "--"]

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY index.js .
COPY docs ./docs

EXPOSE 3000
CMD ["npm","start"]