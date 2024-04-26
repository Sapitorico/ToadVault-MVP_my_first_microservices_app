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
# app config development
DOMAIN=your_domain
PORT=your_port
API_PREFIX=your_api_prefix
API_VERSION=your_api_version

# security
JWT_SECRET=your_jwt_secret
ALGORITHM=your_algorithm

# Microservices
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port

# users microservice
USERS_MICROSERVICE_NAME=your_users_microservice_name

# product microservice
PRODUCT_MICROSERVICE_NAME=your_product_microservice_name

# inventory microservice
INVENTORY_MICROSERVICE_NAME=your_inventory_microservice_name

# order microservice
ORDER_MICROSERVICE_NAME=your_order_microservice_name

# payment microservice
PAYMENT_MICROSERVICE_NAME=your_payment_microservice_name
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
