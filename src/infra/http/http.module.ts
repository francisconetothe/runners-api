import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from '../database/database.module';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { GatewayModule } from '../gateways/gateway.module';

// Auth Strategy
import { JwtStrategy } from '../auth/jwt.strategy';

// Controllers
import { RegisterAthleteController } from './controllers/register-athlete.controller';
import { ConnectStravaController } from './controllers/connect-strava.controller';
import { FetchRecentActivitiesController } from './controllers/fetch-recent-activities.controller';
import { AuthenticateController } from './controllers/authenticate.controller';
import { FetchAthletesStatsController } from './controllers/fetch-athletes-stats.controller';
import { RacesController } from './controllers/races.controller';
// 1. IMPORTAR O NOVO CONTROLLER DE CONFIGURAÇÕES (BANNER)
import { SettingsController } from './controllers/settings.controller';

// Use Cases
import { RegisterAthleteUseCase } from '@/domain/runners/application/use-cases/register-athlete';
import { ConnectStravaUseCase } from '@/domain/runners/application/use-cases/ConnectStravaUseCase';
import { FetchRecentActivitiesUseCase } from '@/domain/runners/application/use-cases/fetch-recent-activities';
import { AuthenticateAthleteUseCase } from '@/domain/runners/application/use-cases/authenticate-athlete';
import { FetchAthletesStatsUseCase } from '@/domain/runners/application/use-cases/fetch-athletes-stats';
import { SyncActivitiesUseCase } from '@/domain/runners/application/use-cases/sync-activities';

// Services
import { StravaService } from '../strava/strava.service';

@Module({
  imports: [
    DatabaseModule,
    CryptographyModule,
    GatewayModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'sua-chave-secreta-aqui',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [
    RegisterAthleteController,
    ConnectStravaController,
    FetchRecentActivitiesController,
    AuthenticateController,
    FetchAthletesStatsController,
    RacesController,
    // 2. REGISTRAR O CONTROLLER DE SETTINGS AQUI
    SettingsController,
  ],
  providers: [
    // Use Cases
    RegisterAthleteUseCase,
    ConnectStravaUseCase,
    FetchRecentActivitiesUseCase,
    AuthenticateAthleteUseCase,
    FetchAthletesStatsUseCase,
    SyncActivitiesUseCase,

    // Services / Strategies
    StravaService,
    JwtStrategy,
  ],
  exports: [SyncActivitiesUseCase],
})
export class HttpModule {}
