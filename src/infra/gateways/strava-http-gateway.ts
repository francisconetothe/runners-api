import {
  StravaAthleteData,
  StravaGateway,
  StravaActivity,
} from '@/domain/runners/application/gateways/strava-gateway';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StravaHttpGateway implements StravaGateway {
  constructor(private httpService: HttpService) {}

  async exchangeCodeForToken(code: string): Promise<StravaAthleteData> {
    const response = await this.httpService.axiosRef.post(
      'https://www.strava.com/oauth/token',
      {
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
      },
    );

    const { athlete, access_token, refresh_token, expires_at } = response.data;

    return {
      stravaId: athlete.id.toString(),
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresAt: expires_at,
    };
  }

  async fetchAthleteActivities(accessToken: string): Promise<StravaActivity[]> {
    // 1. Calcula o timestamp do primeiro dia do mês atual
    const now = new Date();
    const firstDayOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
      0,
      0,
      0,
    );
    const afterTimestamp = Math.floor(firstDayOfMonth.getTime() / 1000);

    console.log(
      `[StravaGateway] 📅 Buscando atividades desde: ${firstDayOfMonth.toLocaleDateString()}`,
    );

    const response = await this.httpService.axiosRef.get(
      'https://www.strava.com/api/v3/athlete/activities',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          per_page: 100,
          after: afterTimestamp, // 👈 Filtra no Strava apenas o mês atual
        },
      },
    );

    console.log(
      `[StravaGateway] ✅ Encontradas ${response.data.length} atividades este mês.`,
    );

    // Mapeamos o retorno bruto do Strava para o nosso formato de domínio
    return response.data.map((activity: any) => {
      return {
        externalId: activity.id.toString(),
        name: activity.name,
        distance: activity.distance,
        movingTime: activity.moving_time,
        type: activity.type,
        startDate: new Date(activity.start_date),
      };
    });
  }
}
