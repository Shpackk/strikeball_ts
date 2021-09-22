FROM node

WORKDIR /app

COPY package*.json ./

RUN npm install -g npm@latest && npm install

COPY . .

CMD ["npm","run","start:dev"]