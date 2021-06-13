<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

## Description

Simple Todo REST API built with NestJS

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Config

Create a .env file on the root directory and set the config values. The available configuration options are:

- `token.expiration.minutes` - Token max age (default 60)
- `server.port` - Listen on port (default 3003)

## API

- Health check: [http://localhost:3003/status](http://localhost:3003/status)
- Swagger docs: [http://localhost:3003/docs](http://localhost:3003/docs)

## License

[MIT licensed](LICENSE).
