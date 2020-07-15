FROM node:12-alpine
WORKDIR /
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3030
CMD [ "node", "src/index.js" ]
