import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

// 1. A interface PRECISA estar aqui
export interface ActivityProps {
  externalId: string;
  athleteId: string;
  name: string;
  distance: number;
  movingTime: number;
  type: string;
  startDate: Date;
}

export class Activity extends Entity<ActivityProps> {
  // 2. Os Getters que resolvem o erro de 'protected' do post anterior
  get externalId() {
    return this.props.externalId;
  }
  get athleteId() {
    return this.props.athleteId;
  }
  get name() {
    return this.props.name;
  }
  get distance() {
    return this.props.distance;
  }
  get movingTime() {
    return this.props.movingTime;
  }
  get type() {
    return this.props.type;
  }
  get startDate() {
    return this.props.startDate;
  }

  static create(props: ActivityProps, id?: UniqueEntityID) {
    const activity = new Activity(props, id);
    return activity;
  }
}
