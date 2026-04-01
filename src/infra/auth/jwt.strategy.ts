// src/infra/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Extrai o token do Header 'Authorization: Bearer XXX'
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // ⚠️ IMPORTANTE: Esta chave deve estar no seu .env e ser a mesma do Login!
      secretOrKey: 'sua-chave-secreta-aqui',
    });
  }

  async validate(payload: any) {
    // O payload é o que foi gravado no token durante o login.
    // Se no login você salvou { sub: athlete.id }, aqui ele volta como payload.sub.

    // Retornamos um objeto que o NestJS vai injetar no 'req.user'
    return {
      id: payload.sub,
      sub: payload.sub,
    };
  }
}
