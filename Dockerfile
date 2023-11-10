FROM node:18-alpine
WORKDIR /user/src/app
COPY package*.json ./
RUN npm install
COPY . .