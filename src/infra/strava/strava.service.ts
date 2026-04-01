// src/infra/strava/strava.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class StravaService {
  private readonly clientId = process.env.STRAVA_CLIENT_ID;
  private readonly clientSecret = process.env.STRAVA_CLIENT_SECRET;

  async getValidToken(refreshToken: string) {
    const response = await axios.post('https://www.strava.com/oauth/token', {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    });
    // Retorna o novo access_token e o novo refresh_token
    return response.data;
  }

  async listActivities(accessToken: string) {
    const response = await axios.get(
      'https://www.strava.com/api/v3/athlete/activities',
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { per_page: 30 }, // Pega as últimas 30 atividades
      },
    );
    return response.data;
  }
}
