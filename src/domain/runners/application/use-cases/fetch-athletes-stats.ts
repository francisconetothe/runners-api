import { Injectable } from '@nestjs/common';
import {
  AthletesRepository,
  AthleteWithStats,
} from '../repositories/athletes-repository';

// Define o formato da resposta que o Use Case entrega
interface FetchAthletesStatsUseCaseResponse {
  athletes: AthleteWithStats[];
}

@Injectable()
export class FetchAthletesStatsUseCase {
  constructor(private athletesRepository: AthletesRepository) {}

  async execute(): Promise<FetchAthletesStatsUseCaseResponse> {
    // 1. Busca os dados no Repositório (Prisma)
    const athletes = await this.athletesRepository.findAllWithStats();

    // 2. Proteção: Garante que 'athletes' é um array antes de tentar dar .sort()
    // Isso evita o Erro 500 caso o banco retorne algo inesperado
    const safeAthletes = Array.isArray(athletes) ? athletes : [];

    // 3. Ordenação: Quem correu mais (totalDistance) fica no topo [Ranking]
    const sortedAthletes = [...safeAthletes].sort(
      (a, b) => (b.totalDistance || 0) - (a.totalDistance || 0),
    );

    return {
      athletes: sortedAthletes,
    };
  }
}
