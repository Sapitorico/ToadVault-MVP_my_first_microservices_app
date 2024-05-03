<div align="center">
  <img src="https://github.com/Sapitorico/ToadVault-MVP_my_first_microservices_app/assets/105575956/31dac66d-a3ff-40bc-bab3-35199f8a1bff" alt="Descripción de la imagen" width="500" height="500">
</div>

# 🐸 ToadVault-MVP_microservices 🛒

ToadVault-MVP_microservices es una caja registradora web basada en microservicios, desarrollada en Nest.js y conectada a través de Redis. Utiliza una arquitectura de microservicios para gestionar diferentes aspectos del negocio, como usuarios, productos, inventario, órdenes y pagos.

## Enlace a la Aplicación en Producción 🚀

Puedes acceder a la aplicación en producción a través del siguiente enlace:

[ToadVault-MVP_microservices](http://ec2-54-232-36-63.sa-east-1.compute.amazonaws.com/api)

¡Disfruta usando ToadVault-MVP_microservices!

## Tecnologías Principales 🚀

- **Framework Backend:** Nest.js
- **Base de Datos:** MongoDB
- **Message Broker:** Redis
- **Contenedorización:** Docker
- **Gestión de Dependencias:** Docker Compose
- **Documentación de API:** Swagger

## Requisitos Previos 🛠️

Antes de ejecutar la aplicación, asegúrate de tener Docker y Docker Compose instalados en tu sistema.

- Puedes instalar Docker siguiendo las instrucciones en [Get Docker](https://docs.docker.com/get-docker/).
- Para instalar Docker Compose, sigue las instrucciones en [Install Docker Compose](https://docs.docker.com/compose/install/).

## Configuración y Ejecución con Docker Compose 🐳

1. Abre el archivo `docker-compose.yml` en un editor de texto.
2. Dentro de cada servicio, encuentra la sección `environment`, donde se definen las variables de entorno.
3. Configura los valores de las variables de entorno según tus necesidades, por ejemplo, los nombres de usuario y contraseñas de MongoDB, las claves de JWT, etc.
4. Guarda los cambios en el archivo `docker-compose.yml`.
5. Abre una terminal y navega hasta el directorio que contiene el archivo `docker-compose.yml`.
6. Ejecuta el siguiente comando para construir y levantar los servicios de la aplicación:

```bash
docker-compose up --build -d
```

- Una vez que todos los servicios estén en funcionamiento, podrás acceder a la aplicación a través del puerto 3000.

¡Y eso es todo! Ahora tu aplicación ToadVault-MVP_microservices estará en funcionamiento y lista para su uso.

## Documentación de API 📚

La documentación de la API está disponible a través de Swagger. Puedes acceder a ella una vez que la aplicación esté en funcionamiento visitando la siguiente URL en tu navegador:

[http://localhost:3000/api](http://localhost:3000/api)

Una vez allí, podrás explorar los diferentes endpoints, ver los esquemas de datos y probar las solicitudes directamente desde el navegador. La documentación de Swagger proporciona una visión completa de la API y facilita su comprensión y uso.

## Descripción de los Microservicios 📦

### Usuarios 👤

El microservicio de Usuarios gestiona la información relacionada con los usuarios registrados en la aplicación. Proporciona eventos para la creación y recuperación de datos de usuario.

### Productos 🛍️

El microservicio de Productos gestiona el catálogo de productos disponibles. Funciona como una base de datos global que será utilizada por todos los usuarios para guardar cualquier producto y su código de barras (barcode). Este microservicio actúa como un repositorio centralizado para todos los productos y sus códigos de barras.

Cualquier nuevo código de barras será agregado automáticamente a esta base de datos. Si un usuario intenta agregar un producto a su inventario y este no existe en la base de datos, el microservicio lo añadirá y luego se lo agregará al inventario del usuario en cuestión. De esta manera, se garantiza que todos los usuarios tengan acceso a un catálogo completo y actualizado de productos.

### Inventario 📦

El microservicio de Inventario controla el stock de productos disponibles en la tienda. Proporciona eventos para gestionar la cantidad de productos disponibles y para realizar ajustes de inventario.

### Orden 📝

El microservicio de Orden gestiona las órdenes realizadas por los usuarios. Funciona como un generador de órdenes única para transacciones de punto de venta.

### Pago 💳

El microservicio de Pago se encarga del procesamiento de los pagos asociados a las órdenes realizadas por los usuarios. Su función principal es recibir las solicitudes de pago, procesar los pagos y devolver el cambio correspondiente al cliente.

### API Gateway 🛣️

El microservicio de API Gateway actúa como punto de entrada principal para la aplicación. Enruta las solicitudes de los clientes a los microservicios correspondientes y gestiona la comunicación entre los diferentes componentes de la aplicación.

## Descripción de los Servicios de Infraestructura 🛠️

### MongoDB 🍃

MongoDB es un sistema de base de datos NoSQL orientado a documentos. En esta aplicación, se utiliza para almacenar datos relacionados con usuarios, productos, inventario, órdenes y otros aspectos del negocio.

### Redis 🔄

Redis es una base de datos en memoria de código abierto que se utiliza como almacén de datos en esta aplicación. Se utiliza para gestionar la mensajería y la comunicación entre los diferentes microservicios de la aplicación
