import { Module } from '@nestjs/common';
import { ExchangeConfigurationsModule } from '../exchange-configurations/exchange-configurations.module';
import { DcaService } from './dca.service';

@Module({
  imports: [ExchangeConfigurationsModule],
  providers: [DcaService],
})
export class DcaModule {}
