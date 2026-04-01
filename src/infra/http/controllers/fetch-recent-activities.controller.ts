import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { FetchRecentActivitiesUseCase } from '@/domain/runners/application/use-cases/fetch-recent-activities';
import { SyncActivitiesUseCase } from '@/domain/runners/application/use-cases/sync-activities';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';

@Controller('/activities')
export class FetchRecentActivitiesController {
  constructor(
    private fetchRecentActivities: FetchRecentActivitiesUseCase,
    private syncActivities: SyncActivitiesUseCase,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async handle(@Request() req: any) {
    // 1. Identifica o Atleta pelo Token
    const athleteId = req.user?.sub;

    console.log('--- 🚀 INICIANDO REQUISIÇÃO NO CONTROLLER ---');
    console.log('ID do Atleta extraído do JWT:', athleteId);

    if (!athleteId) {
      console.error(
        '❌ ERRO: Não foi possível encontrar o ID do atleta no token.',
      );
    } else {
      console.log('1. Disparando Sincronização com Strava...');

      // O 'await' garante que os logs [Sync] apareçam no terminal AGORA
      await this.syncActivities.execute(athleteId);

      console.log('2. Sincronização finalizada com sucesso!');
    }

    // 2. Busca as atividades já sincronizadas para o ranking/dashboard
    console.log('3. Buscando dados para o gráfico...');
    const result = await this.fetchRecentActivities.execute();

    return {
      activities: result.activities.map((activity) => ({
        id: activity.id.toString(),
        name: activity.name,
        distance: activity.distance,
        movingTime: activity.movingTime,
        type: activity.type,
        startDate: activity.startDate,
      })),
    };
  }
}
