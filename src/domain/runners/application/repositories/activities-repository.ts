import { Activity } from '../../enterprise/entities/activity';

export abstract class ActivitiesRepository {
  abstract createMany(activities: Activity[]): Promise<void>;

  abstract findAll(): Promise<Activity[]>;
}
