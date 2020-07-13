FROM node:12
WORKDIR /
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3030
CMD [ "node", "index.js" ]