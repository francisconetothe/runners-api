import {
  Body,
  Controller,
  Post,
  BadRequestException,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ConnectStravaUseCase } from '@/domain/runners/application/use-cases/ConnectStravaUseCase';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'; // 👈 Importante para pegar o req.user

@Controller('/strava')
export class ConnectStravaController {
  constructor(private connectStrava: ConnectStravaUseCase) {}

  @Post('/connect')
  @UseGuards(JwtAuthGuard) // 👈 Garante que só quem está logado acesse
  async handle(
    @Body('code') code: string,
    @Request() req: any, // 👈 Pega os dados do token JWT
  ) {
    // Pega o ID do atleta de dentro do Token (sub)
    const athleteId = req.user.sub;

    if (!code) {
      throw new BadRequestException('Code is required');
    }

    console.log(
      `--- 🚀 PROCESSANDO CONEXÃO STRAVA PARA O ATLETA: ${athleteId} ---`,
    );

    try {
      const result = await this.connectStrava.execute({
        athleteId,
        code,
      });

      return {
        message: 'Strava connected successfully!',
        athlete: {
          id: result.athlete.id.toString(),
          name: result.athlete.name,
          stravaId: result.athlete.stravaId,
        },
        activities: result.activities,
      };
    } catch (error: any) {
      console.error('❌ Erro no ConnectStravaController:', error.message);
      throw new BadRequestException(
        error.message || 'Failed to connect Strava',
      );
    }
  }
}
