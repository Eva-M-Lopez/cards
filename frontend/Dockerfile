FROM node:24-alpine

WORKDIR /app

COPY package.json package-lock.json* ./

COPY shared ./shared

COPY frontend/package.json frontend/package-lock.json* ./frontend/

RUN npm install

COPY . .

WORKDIR /app/frontend

EXPOSE 5173

CMD ["npm", "run", "dev"]
