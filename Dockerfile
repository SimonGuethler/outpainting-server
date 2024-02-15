FROM node:20.11.0

WORKDIR /app

COPY package*.json .
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 8080
CMD ["npm", "start"]
