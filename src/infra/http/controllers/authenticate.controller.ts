import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthenticateAthleteUseCase } from '@/domain/runners/application/use-cases/authenticate-athlete';

@Controller('/sessions')
export class AuthenticateController {
  constructor(private authenticateAthlete: AuthenticateAthleteUseCase) {}

  @Post()
  async handle(@Body() body: any) {
    try {
      const { email, password } = body;

      // 1. Executa o Use Case
      // Ele retorna { accessToken, userId, name, role }
      const result = await this.authenticateAthlete.execute({
        email,
        password,
      });

      // 2. Retorna TUDO para o Frontend (incluindo a ROLE)
      return {
        accessToken: result.accessToken,
        userId: result.userId,
        name: result.name,
        role: result.role, // <--- ESSA LINHA RESOLVE O PROBLEMA DO BOTÃO
      };
    } catch (error) {
      // Mantém a segurança das credenciais
      throw new UnauthorizedException('Credenciais inválidas');
    }
  }
}
