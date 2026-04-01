import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  AthletesRepository,
  AthleteWithStats,
} from '@/domain/runners/application/repositories/athletes-repository';
import { Athlete } from '@/domain/runners/enterprise/entities/athlete';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

@Injectable()
export class PrismaAthletesRepository implements AthletesRepository {
  constructor(private prisma: PrismaService) {}

  async findAllWithStats(): Promise<AthleteWithStats[]> {
    const athletes = await this.prisma.athlete.findMany({
      select: {
        id: true,
        name: true,
        stravaId: true,
        role: true, // 🚀 Adicionado aqui para o mural saber quem é ADM
        activities: {
          select: {
            distance: true,
          },
        },
      },
    });

    return athletes.map((athlete) => {
      const totalDistanceInMeters = (athlete.activities || []).reduce(
        (sum, act) => sum + (act.distance || 0),
        0,
      );

      return {
        id: athlete.id,
        name: athlete.name,
        totalDistance: totalDistanceInMeters / 1000,
        workoutsCount: athlete.activities?.length || 0,
        stravaId: athlete.stravaId,
        role: athlete.role, // Passando para o formato de stats
      };
    });
  }

  async findById(id: string): Promise<Athlete | null> {
    const athlete = await this.prisma.athlete.findUnique({
      where: { id },
    });

    if (!athlete) return null;

    return Athlete.create(
      {
        name: athlete.name,
        email: athlete.email,
        password: athlete.password,
        stravaId: athlete.stravaId,
        role: athlete.role, // Corrigido
      },
      new UniqueEntityID(athlete.id),
    );
  }

  async findByEmail(email: string): Promise<Athlete | null> {
    const athlete = await this.prisma.athlete.findUnique({
      where: { email },
    });

    if (!athlete) return null;

    return Athlete.create(
      {
        name: athlete.name,
        email: athlete.email,
        password: athlete.password,
        stravaId: athlete.stravaId,
        role: athlete.role, // 🚀 Faltava aqui também!
      },
      new UniqueEntityID(athlete.id),
    );
  }

  async create(athlete: Athlete): Promise<void> {
    await this.prisma.athlete.create({
      data: {
        id: athlete.id.toString(),
        name: athlete.name,
        email: athlete.email,
        password: athlete.password,
        role: athlete.role, // 🚀 Faltava aqui!
      },
    });
  }

  async save(athlete: Athlete): Promise<void> {
    await this.prisma.athlete.update({
      where: {
        id: athlete.id.toString(),
      },
      data: {
        stravaId: athlete.stravaId,
        name: athlete.name,
        email: athlete.email,
        password: athlete.password,
        role: athlete.role, // 🚀 Faltava aqui!
      },
    });
  }
}
