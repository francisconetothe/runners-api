import { Injectable } from '@nestjs/common';
import { ActivitiesRepository } from '../repositories/activities-repository';

@Injectable()
export class FetchRecentActivitiesUseCase {
  constructor(private activitiesRepository: ActivitiesRepository) {}

  async execute() {
    // Vamos supor que você adicionou o método 'findAll' no seu repositório
    const activities = await this.activitiesRepository.findAll();
    return { activities };
  }
}
