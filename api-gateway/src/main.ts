import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
process.loadEnvFile();

const domain = process.env.DOMAIN;
const port = process.env.PORT || 3000;
const apiPrefix = process.env.API_PREFIX || 'api';
const apiVersion = process.env.API_VERSION || 'v1';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(`${apiPrefix}/${apiVersion}`);
  const config = new DocumentBuilder()
    .setTitle('ToadVault')
    .setDescription('ToadVault is a web-based cash register application built on microservices architecture.')
    .setDescription('The cats API description')
    .setVersion(apiVersion)
    .addBearerAuth()
    .addTag('authentication')
    .addTag('inventory')
    .addTag('order')
    .addTag('payment')
    .addServer('http://localhost:3000', 'Local environment')
    .addServer(`https://${domain}`, 'Production')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(port || 3000);
}
bootstrap();
