import { Controller, Get, UseGuards, Request } from '@nestjs/common'; // Adicione Request
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { FetchAthletesStatsUseCase } from '@/domain/runners/application/use-cases/fetch-athletes-stats';
import { SyncActivitiesUseCase } from '@/domain/runners/application/use-cases/sync-activities'; // Importe o Sync

@Controller('/athletes/stats')
@UseGuards(JwtAuthGuard)
export class FetchAthletesStatsController {
  constructor(
    private fetchAthletesStats: FetchAthletesStatsUseCase,
    private syncActivities: SyncActivitiesUseCase, // Injete o Sync aqui
  ) {}

  @Get()
  async handle(@Request() req: any) {
    // Adicione o @Request() aqui
    console.log('--- 🚀 REQUISIÇÃO RECEBIDA NO STATS CONTROLLER ---');

    const athleteId = req.user?.sub;

    try {
      // 1. ANTES de pegar o ranking, vamos sincronizar os dados do atleta logado
      if (athleteId) {
        console.log(`1. Sincronizando atividades para o atleta: ${athleteId}`);
        await this.syncActivities.execute(athleteId);
      }

      console.log('2. Buscando estatísticas de todos os atletas...');
      const result = await this.fetchAthletesStats.execute();

      console.log('3. Use Case respondeu com sucesso!');
      return {
        athletes: result.athletes,
      };
    } catch (error: any) {
      console.error('--- ❌ ERRO DENTRO DO CONTROLLER ---');
      console.error('Mensagem:', error.message);
      throw error;
    }
  }
}
