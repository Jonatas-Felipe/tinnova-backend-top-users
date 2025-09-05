/* eslint-disable @typescript-eslint/no-floating-promises */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './shared/infra/http/app';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: process.env.PORT || 3334,
    },
  });
  await app.listen();

  console.log("Microsserviço 'top-users' está rodando na porta 3334");
}

bootstrap();
