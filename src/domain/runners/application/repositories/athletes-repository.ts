import { Athlete } from '../../enterprise/entities/athlete';

export interface AthleteWithStats {
  id: string;
  name: string;
  totalDistance: number;
  workoutsCount: number;
  stravaId?: string | null; // 👈 Adicione isso aqui!
}

export abstract class AthletesRepository {
  abstract findById(id: string): Promise<Athlete | null>;
  abstract findByEmail(email: string): Promise<Athlete | null>;
  abstract create(athlete: Athlete): Promise<void>;
  abstract save(athlete: Athlete): Promise<void>;
  abstract findAllWithStats(): Promise<AthleteWithStats[]>;
}
