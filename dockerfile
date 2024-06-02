# Dockerfile
FROM node:latest

WORKDIR /app

COPY package*.json ./

COPY package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

RUN npx prisma generate

CMD ["npm", "run", "start:prod"]
