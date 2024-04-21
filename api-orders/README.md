## Description

Este es el microservicio de ordene de ToadVault. Este servicio se encarga de gestionar la orden dentro de la plataforma ToadVault. Se construyó utilizando el marco [Nest](https://github.com/nestjs/nest) y TypeScript.

## Installation

```bash
pnpm install
```

## Environment configuration

Para configurar el entorno de la aplicación, necesitarás crear un archivo `.env` en la raíz del proyecto. Este archivo debe contener las siguientes variables de entorno:

```bash
# microservices config
PORT=your_port


# MONGO connection
DB_CONN_STRING=your_database_string_connection
DB_NAME=your_database_name

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
