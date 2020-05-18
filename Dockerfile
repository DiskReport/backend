FROM node:13
# pb with 14 and pg ?
WORKDIR /usr/src/app
EXPOSE 3000
CMD [ "npm", "start" ]
COPY node/package*.json ./
RUN npm install
COPY node/ .
