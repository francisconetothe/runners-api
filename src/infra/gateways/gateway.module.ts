import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { StravaGateway } from '@/domain/runners/application/gateways/strava-gateway';
import { StravaHttpGateway } from './strava-http-gateway';

@Module({
  imports: [HttpModule], // Necessário para o StravaHttpGateway usar o Axios
  providers: [
    {
      provide: StravaGateway,
      useClass: StravaHttpGateway,
    },
  ],
  exports: [StravaGateway], // Exporta para o HttpModule enxergar
})
export class GatewayModule {}
