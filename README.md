# ToadVault-MVP_microservices

ToadVault-MVP_microservices es una caja registradora web basada en microservicios, desarrollada en Nest.js y conectada a través de Kafka. Utiliza una arquitectura de microservicios para gestionar diferentes aspectos del negocio, como usuarios, productos, inventario, órdenes y pagos.

## Tecnologías Principales

- **Framework Backend:** Nest.js
- **Base de Datos:** MongoDB
- **Message Broker:** Kafka
- **Contenedorización:** Docker
- **Gestión de Dependencias:** Docker Compose

## Configuración del Entorno

Antes de ejecutar la aplicación, asegúrate de configurar correctamente el entorno en el archivo `.env` en el directorio raíz.

```env
    MONGO_INITDB_ROOT_USERNAME=your_user
    MONGO_INITDB_ROOT_PASSWORD=yout_password
```

## Ejecución con Docker Compose

Antes de iniciar la aplicación, verifique que el entorno de cada microservicio se haya configurado correctamente según lo especificado en sus respectivos READMEs. Los requisitos de configuración de cada microservicio incluyen variables de entorno específicas. Consulte los READMEs de cada microservicio para obtener instrucciones detalladas sobre cómo configurar su entorno.

Para ejecutar la aplicación, sigue estos pasos:

1. Asegúrate de tener Docker y Docker Compose instalados en tu sistema.

2. Navega al directorio raíz del proyecto clonado.

3. Crea un archivo `.env` en el directorio raíz y configura las variables de entorno requeridas

4. Configura el entorno para cada microservicio según lo requerido en sus respectivos READMEs. Esto puede incluir la configuración de variables de entorno específicas y otros ajustes necesarios para cada microservicio.

5. Ejecuta el siguiente comando para construir y levantar los servicios de la aplicación:

```bash
    docker-compose up --build -d
```

Este comando construirá las imágenes de Docker necesarias para cada servicio y luego las levantará en contenedores en segundo plano.

6. Una vez que todos los servicios estén en funcionamiento, podrás acceder a la aplicación a través del puerto 3000.

¡Y eso es todo! Ahora tu aplicación ToadVault-MVP_microservices estará en funcionamiento y lista para su uso.

## Documentación de API

La documentación de la API está disponible a través de Swagger. Puedes acceder a ella una vez que la aplicación esté en funcionamiento visitando la siguiente URL en tu navegador:

[http://localhost:3000/api](http://localhost:3000/api)

Una vez allí, podrás explorar los diferentes endpoints, ver los esquemas de datos y probar las solicitudes directamente desde el navegador. La documentación de Swagger proporciona una visión completa de la API y facilita su comprensión y uso.

## Descripción de los Microservicios

### Usuarios

El microservicio de Usuarios gestiona la información relacionada con los usuarios registrados en la aplicación. Proporciona eventos para la creación y recuperación de datos de usuario.

### Productos

El microservicio de Productos gestiona el catálogo de productos disponibles. Funciona como una base de datos global que será utilizada por todos los usuarios para guardar cualquier producto y su código de barras (barcode). Este microservicio actúa como un repositorio centralizado para todos los productos y sus códigos de barras.

Cualquier nuevo código de barras será agregado automáticamente a esta base de datos. Si un usuario intenta agregar un producto a su inventario y este no existe en la base de datos, el microservicio lo añadirá y luego se lo agregará al inventario del usuario en cuestión. De esta manera, se garantiza que todos los usuarios tengan acceso a un catálogo completo y actualizado de productos.

### Inventario

El microservicio de Inventario controla el stock de productos disponibles en la tienda. Proporciona eventos para gestionar la cantidad de productos disponibles y para realizar ajustes de inventario.

### Orden

El microservicio de Orden gestiona las órdenes realizadas por los usuarios. Funciona como un generador de órdenes única para transacciones de punto de venta.

### Pago

El microservicio de Pago se encarga del procesamiento de los pagos asociados a las órdenes realizadas por los usuarios. Su función principal es recibir las solicitudes de pago, procesar los pagos y devolver el cambio correspondiente al cliente.

### API Gateway

El microservicio de API Gateway actúa como punto de entrada principal para la aplicación. Enruta las solicitudes de los clientes a los microservicios correspondientes y gestiona la comunicación entre los diferentes componentes de la aplicación.

## Descripción de los Servicios de Infraestructura

### MongoDB

MongoDB es un sistema de base de datos NoSQL orientado a documentos. En esta aplicación, se utiliza para almacenar datos relacionados con usuarios, productos, inventario, órdenes y otros aspectos del negocio.

### Kafka

Kafka es una plataforma de transmisión distribuida que proporciona una arquitectura de mensajería de alto rendimiento y tolerante a fallos. Se utiliza como broker de mensajes para la comunicación entre los microservicios de la aplicación.

### ZooKeeper

ZooKeeper es un servicio de coordinación distribuida utilizado para la gestión de configuraciones, elección de líderes y otros aspectos de la infraestructura distribuida. En esta aplicación, se utiliza para coordinar y gestionar clústeres de Kafka.
