export interface StravaActivity {
  externalId: string;
  name: string;
  distance: number;
  movingTime: number;
  type: string;
  startDate: Date;
}

export interface StravaAthleteData {
  stravaId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export abstract class StravaGateway {
  abstract exchangeCodeForToken(code: string): Promise<StravaAthleteData>;
  abstract fetchAthleteActivities(
    accessToken: string,
  ): Promise<StravaActivity[]>;
}
