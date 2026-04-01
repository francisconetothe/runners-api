import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import { UserRole } from '@prisma/client'; // 🚀 IMPORTANTE: Importa o Enum do Prisma

export interface AthleteProps {
  name: string;
  email: string;
  password: string;
  role: UserRole; // 👈 Mudamos de string para UserRole
  stravaId?: string | null;
  stravaToken?: string | null;
  stravaRefreshToken?: string | null;
  createdAt: Date;
}

export class Athlete extends Entity<AthleteProps> {
  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  get stravaId() {
    return this.props.stravaId;
  }

  set stravaId(stravaId: string | null | undefined) {
    this.props.stravaId = stravaId;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get stravaToken() {
    return this.props.stravaToken;
  }

  set stravaToken(token: string | null | undefined) {
    this.props.stravaToken = token;
  }

  get stravaRefreshToken() {
    return this.props.stravaRefreshToken;
  }

  set stravaRefreshToken(token: string | null | undefined) {
    this.props.stravaRefreshToken = token;
  }

  // --- LOGICA DE ROLE ---
  get role(): UserRole {
    return this.props.role;
  }

  set role(role: UserRole) {
    this.props.role = role;
  }

  static create(
    props: Optional<AthleteProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const athlete = new Athlete(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return athlete;
  }
}
