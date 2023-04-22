FROM node:14-alpine AS server-builder

WORKDIR /build
COPY server .
RUN apk add --no-cache libc6-compat
RUN rm -rf node_modules
RUN npm i -g @vercel/ncc
RUN npm install
RUN ncc build ./src/main.ts -o build

FROM node:14-alpine AS client-builder

WORKDIR /build
COPY client .
RUN apk add --no-cache libc6-compat
RUN rm package-lock.json
RUN rm -rf node_modules
RUN npm install
RUN npm run build

FROM node:14-alpine

USER 1000
WORKDIR /build
COPY --from=client-builder /build/build ./client
COPY --from=server-builder /build/build ./server
EXPOSE 3000
CMD ["node", "server/index"]
