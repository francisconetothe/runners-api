// src/domain/runners/application/use-cases/ConnectStravaUseCase.ts
import { Injectable } from '@nestjs/common';
import { AthletesRepository } from '../repositories/athletes-repository';
import { StravaGateway } from '../gateways/strava-gateway';
import { ActivitiesRepository } from '../repositories/activities-repository';
import { Activity } from '../../enterprise/entities/activity';
import { Athlete } from '../../enterprise/entities/athlete';

interface ConnectStravaUseCaseRequest {
  athleteId: string;
  code: string;
}

// Interface para definir o que o Use Case devolve
interface ConnectStravaUseCaseResponse {
  athlete: Athlete;
  activities: any[]; // Lista de atividades vinda do Gateway
}

@Injectable()
export class ConnectStravaUseCase {
  constructor(
    private activitiesRepository: ActivitiesRepository,
    private athletesRepository: AthletesRepository,
    private stravaGateway: StravaGateway,
  ) {}

  async execute({
    athleteId,
    code,
  }: ConnectStravaUseCaseRequest): Promise<ConnectStravaUseCaseResponse> {
    console.log(
      `[Connect] 🔗 Iniciando conexão Strava para o atleta: ${athleteId}`,
    );

    // 1. Busca o atleta no nosso banco
    const athlete = await this.athletesRepository.findById(athleteId);

    if (!athlete) {
      console.error('[Connect] ❌ Atleta não encontrado.');
      throw new Error('Athlete not found');
    }

    // 2. Troca o código pelos tokens
    const stravaData = await this.stravaGateway.exchangeCodeForToken(code);
    console.log('[Connect] ✅ Tokens obtidos do Strava com sucesso.');

    // 3. Atualiza os dados do Strava no Atleta
    // Lembre-se: se der erro aqui, você precisa adicionar esses campos na sua classe Athlete!
    athlete.stravaId = stravaData.stravaId;
    athlete.stravaToken = stravaData.accessToken;
    athlete.stravaRefreshToken = stravaData.refreshToken;

    await this.athletesRepository.save(athlete);
    console.log('[Connect] 💾 Dados do Strava salvos no perfil do atleta.');

    // 4. Busca as atividades reais no Strava usando o Access Token
    console.log('[Connect] 🏃 Buscando atividades iniciais no Strava...');
    const stravaActivities = await this.stravaGateway.fetchAthleteActivities(
      stravaData.accessToken,
    );

    // 5. Converte os dados para Entidades do Domínio
    const activityEntities = stravaActivities.map((activity) => {
      return Activity.create({
        externalId: String(activity.externalId),
        athleteId: athlete.id.toString(),
        name: activity.name,
        distance: activity.distance,
        movingTime: activity.movingTime,
        type: activity.type,
        startDate: activity.startDate,
      });
    });

    // 6. Persiste as atividades
    if (activityEntities.length > 0) {
      await this.activitiesRepository.createMany(activityEntities);
      console.log(
        `[Connect] ✨ ${activityEntities.length} atividades importadas.`,
      );
    }

    // 🚀 RETORNO ATUALIZADO: Agora o Controller vai encontrar a propriedade 'activities'
    return {
      athlete,
      activities: stravaActivities,
    };
  }
}
