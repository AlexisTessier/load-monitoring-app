FROM node:11.4.0-alpine

RUN apk add --no-cache bash git

RUN npm config set save true && \
	npm config set save-exact true &&\
	npm i -g yarn