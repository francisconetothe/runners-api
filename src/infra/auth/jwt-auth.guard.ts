import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
// 🚨 O 'export' é obrigatório para o Controller conseguir enxergar a classe
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
}
