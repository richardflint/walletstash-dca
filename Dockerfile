FROM node:14-alpine AS server-builder

WORKDIR /build
COPY server .
RUN apk add --no-cache libc6-compat
RUN rm -rf node_modules
RUN npm i -g @vercel/ncc
RUN npm install
RUN ncc build ./src/main.ts -o build

FROM node:14-alpine

USER 1000
WORKDIR /build
COPY --from=server-builder /build/build ./server
EXPOSE 3000
CMD ["node", "server/index"]
