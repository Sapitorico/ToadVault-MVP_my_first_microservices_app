## Description

Este proyecto es la API Gateway para la plataforma ToadVault. Su principal función es actuar como un punto de entrada único para todas las solicitudes de los clientes, y luego enrutar esas solicitudes a los microservicios correspondientes.

Los microservicios con los que se comunica son:

- Microservicio de usuarios
- Microservicio de productos
- Microservicio de inventario
- Microservicio de orden
- Microservicio de pagos

La API Gateway se encarga de la autenticación, el enrutamiento, la gestión de solicitudes y respuestas, y la agregación de datos de varios microservicios.

## Installation

```bash
pnpm install
```

## Environment configuration

Para configurar el entorno de la aplicación, necesitarás crear un archivo `.env` en la raíz del proyecto. Este archivo debe contener las siguientes variables de entorno:

```bash
# enviroment
ENVIROMET=your_enviroment


# app config development
HOSTNAME=your_hostname_dev
PORT=your_port_dev

# api config
API_PREFIX=your_api_prefix
API_VERSION=your_api_version

# security
JWT_SECRET=your_secret_key

# users microservice
USERS_MICROSERVICE_NAME=your_microservice_name
USERS_MICROSERVICE_PORT=your_microservice_port

# product microservice
PRODUCT_MICROSERVICE_NAME=your_microservice_name
PRODUCT_MICROSERVICE_PORT=your_microservice_port

# inventory microservice
INVENTORY_MICROSERVICE_NAME=your_microservice_name
INVENTORY_MICROSERVICE_PORT=your_microservice_port

# inventory microservice
ORDER_MICROSERVICE_NAME=your_microservice_name
ORDER_MICROSERVICE_PORT=your_microservice_port

# payment microservice
PAYMENT_MICROSERVICE_NAME=your_microservice_name
PAYMENT_MICROSERVICE_PORT=your_microservice_port
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
