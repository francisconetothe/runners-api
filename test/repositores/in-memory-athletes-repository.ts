import { AthletesRepository } from '@/domain/runners/application/repositories/athletes-repository';
import { Athlete } from '@/domain/runners/enterprise/entities/athlete';

export class InMemoryAthletesRepository implements AthletesRepository {
  public items: Athlete[] = [];

  findByEmail(email: string): Promise<Athlete | null> {
    const athlete = this.items.find((item) => item.email === email);

    // Se não encontrar, retornamos null explicitamente
    if (!athlete) {
      return Promise.resolve(null);
    }

    // Se encontrar, retornamos o atleta com um casting 'as Athlete'
    // para forçar o ESLint a aceitar o tipo.
    return Promise.resolve(athlete as Athlete);
  }

  create(athlete: Athlete): Promise<void> {
    this.items.push(athlete);

    return Promise.resolve();
  }
}
