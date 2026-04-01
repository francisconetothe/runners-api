import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { StravaService } from '@/infra/strava/strava.service';

@Injectable()
export class SyncActivitiesUseCase {
  constructor(
    private prisma: PrismaService,
    private strava: StravaService,
  ) {}

  async execute(athleteId: string) {
    console.log(
      `\n[Sync] 🔍 Iniciando sincronização para o atleta ID: ${athleteId}`,
    );

    const athlete = await this.prisma.athlete.findUnique({
      where: { id: athleteId },
    });

    if (!athlete) {
      console.log(`[Sync] ❌ ERRO: Atleta não encontrado no banco de dados.`);
      return;
    }

    // O ponto onde a maioria dos problemas acontece
    if (!athlete.stravaRefreshToken) {
      console.log(
        `[Sync] ⚠️ ABORTADO: O atleta ${athlete.name} não possui um 'stravaRefreshToken' no banco.`,
      );
      console.log(
        `[Sync] DICA: Certifique-se de que o fluxo de autorização (OAuth) salvou este campo.`,
      );
      return;
    }

    try {
      console.log(
        `[Sync] 🔑 Refresh Token encontrado. Solicitando novo Access Token ao Strava...`,
      );

      const { access_token, refresh_token } = await this.strava.getValidToken(
        athlete.stravaRefreshToken,
      );

      console.log(
        `[Sync] ✅ Tokens renovados com sucesso. Atualizando banco de dados...`,
      );

      // 2. Atualiza os tokens no seu banco para a próxima vez
      await this.prisma.athlete.update({
        where: { id: athleteId },
        data: { stravaToken: access_token, stravaRefreshToken: refresh_token },
      });

      console.log(`[Sync] 🏃 Buscando atividades recentes na API do Strava...`);
      const stravaActivities = await this.strava.listActivities(access_token);

      console.log(
        `[Sync] 📊 Foram encontradas ${stravaActivities.length} atividades no Strava.`,
      );

      let upsertCount = 0;

      // 4. Salva apenas as novas (ou atualiza) usando o externalId
      for (const act of stravaActivities) {
        await this.prisma.activity.upsert({
          where: { externalId: String(act.id) },
          update: {
            name: act.name,
            distance: act.distance,
          },
          create: {
            externalId: String(act.id),
            name: act.name,
            distance: act.distance,
            movingTime: act.moving_time,
            type: act.type,
            startDate: new Date(act.start_date),
            athleteId: athleteId,
          },
        });
        upsertCount++;
      }

      console.log(
        `[Sync] ✨ Sincronização concluída! ${upsertCount} atividades processadas.\n`,
      );
    } catch (error: any) {
      console.error(`[Sync] 🚨 ERRO DURANTE A SINCRONIZAÇÃO:`);
      if (error.response) {
        console.error(`[Sync] Status da API: ${error.response.status}`);
        console.error(`[Sync] Detalhes:`, error.response.data);
      } else {
        console.error(`[Sync] Mensagem: ${error.message}`);
      }
    }
  }
}
