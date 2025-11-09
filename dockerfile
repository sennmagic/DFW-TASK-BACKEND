
FROM node:18-alpine


WORKDIR /app

Copy package files
COPY package*.json ./
COPY tsconfig.json ./


RUN npm install

COPY . .


RUN npm run build


EXPOSE 4000


CMD ["npm", "start"]
