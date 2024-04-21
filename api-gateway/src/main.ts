import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const deveHost = process.env.HOSTNAME || 'localhost';
const devPort = process.env.PORT || 3000;
const apiPrefix = process.env.API_PREFIX || 'api';
const apiVersion = process.env.API_VERSION || 'v1';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(`${apiPrefix}/${apiVersion}`);
  const config = new DocumentBuilder()
    .setTitle('ToadVault')
    .setDescription('The cats API description')
    .setVersion(apiVersion)
    .addBearerAuth()
    .addTag('authentication')
    .addTag('inventory')
    .addTag('order')
    .addTag('payment')
    .addServer(`http://${deveHost}:${devPort}/`, 'Local environment')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(devPort || 3000);
}
bootstrap();
