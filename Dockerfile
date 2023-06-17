FROM node:18.16.0

WORKDIR /app

COPY package*.json .
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 8080
CMD ["npm", "start"]
