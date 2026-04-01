import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

// Repositórios (Contratos)
import { AthletesRepository } from '@/domain/runners/application/repositories/athletes-repository';
import { ActivitiesRepository } from '@/domain/runners/application/repositories/activities-repository';

// Implementações Prisma
import { PrismaAthletesRepository } from './prisma/repositories/prisma-athletes-repository';
import { PrismaActivitiesRepository } from './prisma/repositories/prisma-activities-repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: AthletesRepository,
      useClass: PrismaAthletesRepository,
    },
    {
      // Registramos o novo repositório de atividades aqui
      provide: ActivitiesRepository,
      useClass: PrismaActivitiesRepository,
    },
  ],
  // Exportamos ambos para que o HttpModule consiga enxergá-los
  exports: [PrismaService, AthletesRepository, ActivitiesRepository],
})
export class DatabaseModule {}
