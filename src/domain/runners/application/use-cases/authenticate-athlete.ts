import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AthletesRepository } from '../repositories/athletes-repository';
import { HashComparer } from '../cryptography/hash-comparer';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthenticateAthleteUseCase {
  constructor(
    private athletesRepository: AthletesRepository,
    private hashComparer: HashComparer,
    private jwtService: JwtService,
  ) {}

  async execute({ email, password }: any) {
    const athlete = await this.athletesRepository.findByEmail(email);

    if (!athlete) {
      throw new UnauthorizedException('E-mail ou senha inválidos');
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      athlete.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('E-mail ou senha inválidos');
    }

    // --- 🔐 JWT COM PAYLOAD COMPLETO ---
    // Adicionamos a role no payload do token para que os Guards do NestJS também funcionem
    const accessToken = this.jwtService.sign({
      sub: athlete.id.toString(),
      role: athlete.role, // Certifique-se que o campo no seu banco se chama 'role'
    });

    // 🚀 RETORNO COMPLETO PARA O FRONTEND
    // Ajustado para bater exatamente com o que o seu Login (page.tsx) espera ler
    return {
      accessToken,
      userId: athlete.id.toString(), // Enviando na raiz como o front espera
      name: athlete.name,
      role: athlete.role, // AGORA SIM! O Front vai receber 'ADMIN' ou 'USER'
    };
  }
}
