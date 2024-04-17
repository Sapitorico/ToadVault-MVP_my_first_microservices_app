import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// Configurar el prefijo de la API y la versión
const apiPrefix = process.env.API_PREFIX;
const apiVersion = process.env.VERSION;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(`${apiPrefix}/${apiVersion}`);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
