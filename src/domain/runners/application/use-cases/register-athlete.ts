import { Injectable } from '@nestjs/common'; // <-- Importação necessária
import { Athlete } from '../../enterprise/entities/athlete';
import { AthletesRepository } from '../repositories/athletes-repository';
import { HashGenerator } from '../cryptography/hash-generator';

interface RegisterAthleteUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

// O NestJS precisa desse decorator para instanciar a classe e injetar os repositórios
@Injectable()
export class RegisterAthleteUseCase {
  constructor(
    // O NestJS vai buscar quem está registrado como AthletesRepository e injetar aqui
    private athletesRepository: AthletesRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
  }: RegisterAthleteUseCaseRequest): Promise<{ athlete: Athlete }> {
    // Agora o this.athletesRepository não será mais undefined
    const athleteWithSameEmail =
      await this.athletesRepository.findByEmail(email);

    if (athleteWithSameEmail) {
      throw new Error('Athlete with same email already exists.');
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const athlete = Athlete.create({
      name,
      email,
      password: hashedPassword,
      role: 'USER',
    }) as Athlete;

    await this.athletesRepository.create(athlete);

    return { athlete };
  }
}
