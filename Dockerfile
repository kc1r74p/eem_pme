FROM node:12
WORKDIR /src/
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3030
CMD [ "node", "index.js" ]