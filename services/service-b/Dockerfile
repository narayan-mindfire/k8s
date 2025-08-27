FROM node:20-alpine AS builder
WORKDIR /usr/src/app

COPY services/service-b/package*.json ./
RUN npm install

COPY services/service-b/tsconfig.json ./
COPY services/service-b/src ./src

RUN npm run build

FROM node:20-alpine
WORKDIR /usr/src/app

COPY services/service-b/package*.json ./
RUN npm install --omit=dev

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 9091
CMD ["npm", "start"]
