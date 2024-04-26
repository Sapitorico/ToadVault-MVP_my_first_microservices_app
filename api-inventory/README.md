## Description

Este es el microservicio de inventario de ToadVault. Este servicio se encarga de gestionar el inventairo de cada usuario dentro de la plataforma ToadVault. Se construyó utilizando el marco [Nest](https://github.com/nestjs/nest) y TypeScript.

## Installation

```bash
pnpm install
```

## Environment configuration

Para configurar el entorno de la aplicación, necesitarás crear un archivo `.env` en la raíz del proyecto. Este archivo debe contener las siguientes variables de entorno:

```bash
#MONGO connection
DB_CONN_STRING=mongodb://root:evolina553@mongodb:27017
DB_NAME=inventory_db

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
