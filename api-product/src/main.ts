import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// Configurar el prefijo de la API y la versión
const apiPrefix = 'api';
const apiVersion = 'v1';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(`${apiPrefix}/${apiVersion}`);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
