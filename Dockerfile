FROM node:8.15-alpine

RUN apk add --no-cache tini
ENTRYPOINT ["/sbin/tini", "--"]

RUN npm i docsify-cli@4.1.7 -g
COPY docs /app/src
EXPOSE 4000
CMD ["/usr/bin/timeout","-t","30","docsify","start","/app/src"]