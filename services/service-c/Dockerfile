FROM node:20-alpine AS builder
WORKDIR /usr/src/app

COPY services/service-c/package*.json ./
RUN npm install

COPY services/service-c/tsconfig.json ./
COPY services/service-c/src ./src

RUN npm run build

FROM node:20-alpine
WORKDIR /usr/src/app

COPY services/service-c/package*.json ./
RUN npm install --omit=dev

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 5001
EXPOSE 9092
CMD ["npm", "start"]
