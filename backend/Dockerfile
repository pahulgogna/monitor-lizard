FROM node:20-alpine

COPY . .

RUN npm install
RUN npm run build
RUN npx prisma generate

CMD ["node", "dist/index.js"]