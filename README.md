## Walletstash DCA

Walletstash DCA is a self-hosted Dollar Cost Average (DCA) solution, it allows the user setup different configurations that 
connect to a crypto exchange that they have an account for (via api keys), and will automatically convert one currency into 
another and withdrawal the funds. For example a user could set with their bank a daily amount of fiat to be sent to an exchange
Walletstash DCA will convert that fiat to BTC and then withdrawal the BTC to their noncustodial wallet. 

## Build
```bash
$ docker build . -t walletstash-dca-server:latest 
```

## Run
```bash
$ docker-compose up
```
