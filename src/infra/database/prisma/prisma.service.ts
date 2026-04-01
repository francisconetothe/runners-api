import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    // Aqui você pode configurar logs para ver as queries no terminal
    super({
      log: ['query', 'warn', 'error'],
    });
  }

  // Conecta ao banco assim que o módulo inicia
  async onModuleInit() {
    await this.$connect();
  }

  // Fecha a conexão quando o app desliga (evita vazamento de memória)
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
