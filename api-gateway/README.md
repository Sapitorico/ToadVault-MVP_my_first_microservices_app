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
BROKER=your_broker

# users microservice
USERS_MICROSERVICE_NAME=your_users_microservice_name
USERS_CLIENT_ID=your_users_client_id
USERS_GROUP_ID=your_users_group_id

# product microservice
PRODUCT_MICROSERVICE_NAME=your_product_microservice_name
PRODUCT_CLIENT_ID=your_product_client_id
PRODUCT_GROUP_ID=your_product_group_id

# inventory microservice
INVENTORY_MICROSERVICE_NAME=your_inventory_microservice_name
INVENTORY_CLIENT_ID=your_inventory_client_id
INVENTORY_GROUP_ID=your_inventory_group_id

# order microservice
ORDER_MICROSERVICE_NAME=your_order_microservice_name
ORDER_CLIENT_ID=your_order_client_id
ORDER_GROUP_ID=your_order_group_id

# payment microservice
PAYMENT_MICROSERVICE_NAME=your_payment_microservice_name
PAYMENT_CLIENT_ID=your_payment_client_id
PAYMENT_GROUP_ID=your_payment_group_id
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
