FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN chmod +x docker-entrypoint.sh
RUN chmod +x wait-for-it.sh

ENTRYPOINT ["/app/docker-entrypoint.sh"]
