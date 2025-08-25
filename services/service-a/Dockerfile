FROM node:20-alpine AS builder
WORKDIR /usr/src/app

COPY services/service-a/package*.json ./
RUN npm install

COPY services/service-a/tsconfig.json ./
COPY services/service-a/src ./src

RUN npm run build

FROM node:20-alpine
WORKDIR /usr/src/app

COPY services/service-a/package*.json ./
RUN npm install --omit=dev

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 5000
CMD ["npm", "start"]
