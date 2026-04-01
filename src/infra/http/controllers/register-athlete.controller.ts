import { Body, Controller, Post, ConflictException } from '@nestjs/common';
import { RegisterAthleteUseCase } from '@/domain/runners/application/use-cases/register-athlete';

@Controller('/athletes') // Define a rota: http://localhost:3333/athletes
export class RegisterAthleteController {
  constructor(private registerAthlete: RegisterAthleteUseCase) {}

  @Post()
  async handle(@Body() body: any) {
    const { name, email, password } = body;

    try {
      await this.registerAthlete.execute({
        name,
        email,
        password,
      });

      return { message: 'Athlete registered successfully!' };
    } catch (error) {
      console.error(error); // <--- ADICIONE ISSO AQUI PARA VER O ERRO NO TERMINAL
      throw new ConflictException('Registration failed.');
    }
  }
}
