FROM node:18

WORKDIR /app

COPY package.json package-lock.json* ./  

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3002

CMD ["npm", "run", "start"]
