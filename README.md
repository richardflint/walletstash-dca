## Walletstash DCA

Walletstash DCA is a self-hosted Dollar Cost Average (DCA) solution, it allows the user setup different configurations that 
connect to a crypto exchange that they have an account for (via api keys), and will automatically convert one currency into 
another and withdrawal the funds. For example a user could set up with their bank a daily amount of fiat to be sent to an exchange
Walletstash DCA will convert that fiat to BTC and then withdraw the BTC to their noncustodial wallet. 

## Quick Start
### Prerequisites
- Docker
- Docker Compose
- A crypto exchange account and API keys (Binance, Kraken, etc.)

### Setup
1. Create a docker-compose.yml file in the root directory of the project.

Update the `SEED_USERNAME` and `SEED_PASSWORD` to your desired username and password to be used to access the application.

**docker-compose.yml**
```yaml 
services:
  backend:
    image: ghcr.io/richardflint/richardflint/walletstash-dca:v0.0.9
    restart: on-failure
    stop_grace_period: 1m
    environment:
      - SEED_USERNAME=admin
      - SEED_PASSWORD=password
      - LOGS_DIR=/build/logs/
      - DB_DIR=/build/db/
    ports:
      - 3000:3000
    volumes:
      - ./db:/build/db
      - ./logs:/build/logs
```
2. Create a db directory for the sqlite database.
```bash
$ mkdir db
```
3. Create a logs directory for the logs.
```bash
$ mkdir logs
```
### Run the application
```bash
$ docker-compose up -d
```

### Stopping the application
```bash
$ docker-compose down
```

### Access the application
- Open your web browser and go to `http://localhost:3000`
- Login with the default credentials defined in the docker-compose.yml file:

## Build
```bash
$ docker build . -t walletstash-dca-server:latest 
```

## Run
```bash
$ docker-compose up
```
