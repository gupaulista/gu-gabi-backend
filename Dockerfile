FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# O Prisma precisa do schema para gerar o client
RUN npx prisma generate

RUN npm run build

EXPOSE 3333

CMD ["npm", "start"]
