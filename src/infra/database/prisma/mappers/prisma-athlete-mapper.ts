import { Athlete as PrismaUser } from '@prisma/client';
import { Athlete } from '@/domain/runners/enterprise/entities/athlete';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export class PrismaAthleteMapper {
  static toDomain(raw: PrismaUser): Athlete {
    return Athlete.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
        role: raw.role,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(athlete: Athlete) {
    return {
      id: athlete.id.toString(),
      name: athlete.name,
      email: athlete.email,
      password: athlete.password,
    };
  }
}
