## Description

Este es el microservicio de usuarios de ToadVault. Este servicio se encarga de gestionar todos los usuarios de ToadVault. Se construyó utilizando el marco [Nest](https://github.com/nestjs/nest) y TypeScript.

## Installation

```bash
pnpm install
```

## Environment configuration

Para configurar el entorno de la aplicación, necesitarás crear un archivo `.env` en la raíz del proyecto. Este archivo debe contener las siguientes variables de entorno:

```bash
# security
PASSWORD_SALT=your_password_salt
JWT_SECRET=your_jwt_secret

# MONGO connection
DB_CONN_STRING=your_database_string_connection
DB_NAME=your_database_name

# Microservice config
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```
