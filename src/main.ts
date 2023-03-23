import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService>(ConfigService);
  const prismaService = app.get<PrismaService>(PrismaService);
  const port = parseInt(configService.get('APP_PORT'));

  await prismaService.enableShutdownHooks(app);

  await app.listen(port);
}
bootstrap();
