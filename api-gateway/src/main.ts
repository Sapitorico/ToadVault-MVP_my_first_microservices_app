import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { AuthGuard } from './guards/auth.gateway.provider';

const apiPrefix = process.env.API_PREFIX || 'api';
const apiVersion = process.env.API_VERSION || 'v1';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(`${apiPrefix}/${apiVersion}`);
  // app.useGlobalGuards(new AuthGuard());
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
