import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ActivitiesRepository } from '@/domain/runners/application/repositories/activities-repository';
import { Activity } from '@/domain/runners/enterprise/entities/activity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

@Injectable()
export class PrismaActivitiesRepository implements ActivitiesRepository {
  constructor(private prisma: PrismaService) {}

  async createMany(activities: Activity[]): Promise<void> {
    const data = activities.map((activity) => {
      return {
        id: activity.id.toString(),
        externalId: activity.externalId,
        athleteId: activity.athleteId,
        name: activity.name,
        distance: activity.distance,
        movingTime: activity.movingTime,
        type: activity.type,
        startDate: activity.startDate,
      };
    });

    await this.prisma.activity.createMany({
      data,
      skipDuplicates: true,
    });
  }

  async findAll(): Promise<Activity[]> {
    const activities = await this.prisma.activity.findMany({
      orderBy: {
        startDate: 'desc',
      },
    });

    return activities.map((activity) => {
      return Activity.create(
        {
          externalId: activity.externalId,
          athleteId: activity.athleteId,
          name: activity.name,
          distance: activity.distance,
          movingTime: activity.movingTime,
          type: activity.type,
          startDate: activity.startDate,
        },
        new UniqueEntityID(activity.id),
      );
    });
  }
}
