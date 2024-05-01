FROM node:20-alpine
WORKDIR /app
COPY ./apps/mpserver/package.json ./
RUN npm install
COPY ./apps/mpserver/index.ts ./
COPY ./apps/mpserver/tsconfig.json ./
RUN npx tsc
RUN apk --no-cache add curl
EXPOSE 8080
CMD ["node", "index.js"]