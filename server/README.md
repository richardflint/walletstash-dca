## Description

Walletstash dca server is a backend service that runs on a cron job, it runs different configurations that can be used
to connect to an exchange, convert deposits and withdraw to a noncustodial wallet. 

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Build
```bash
$ docker build . -t walletstash-dca-server:latest 
```

## Release
```bash
$ docker save --output walletstash-dca-server.tar walletstash-dca-server:latest

$ scp walletstash-dca-server.tar root@<ip>:/root/walletstash-dca-server/

```

## Database migrations
```bash
$ npx typeorm-ts-node-esm migration:generate -d ./src/data-source.ts ./src/migrations/inital
```
