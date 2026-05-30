FROM node:20-alpine

WORKDIR /app

# Install compilers for multiple languages
RUN apk add --no-cache \
    openjdk11 \
    gcc \
    g++ \
    musl-dev

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "start"]
