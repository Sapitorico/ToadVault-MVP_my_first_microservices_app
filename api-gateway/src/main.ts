import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const apiPrefix = process.env.API_PREFIX || 'api';
const apiVersion = process.env.API_VERSION || 'v1';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(`${apiPrefix}/${apiVersion}`);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
