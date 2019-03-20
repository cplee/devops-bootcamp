FROM node:8.15-alpine
RUN npm i docsify-cli@4.1.7 -g
COPY docs /app/src
EXPOSE 4000
ENTRYPOINT docsify start /app/src