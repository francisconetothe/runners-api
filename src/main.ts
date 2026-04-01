import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express'; // Importante para o static
import { join } from 'path';

async function bootstrap() {
  // Adicionamos o tipo NestExpressApplication para habilitar o useStaticAssets
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Habilita o CORS para o Next.js conseguir conversar com o NestJS
  app.enableCors();

  // Configura a pasta 'uploads' para ser acessível via URL
  // Exemplo: http://localhost:3333/uploads/foto.jpg
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  await app.listen(process.env.PORT ?? 3333);
  console.log(`🚀 Backend rodando em: http://localhost:3333`);
}
bootstrap();
