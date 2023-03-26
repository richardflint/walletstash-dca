import { Module } from '@nestjs/common';
import { ExchangeConfigurationsController } from './exchange-configurations.controller';
import { ExchangeConfigurationsService } from './exchange-configurations.service';
import { ExchangeConfiguration } from './exchange-configuration.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [ExchangeConfigurationsController],
  providers: [ExchangeConfigurationsService],
  imports: [TypeOrmModule.forFeature([ExchangeConfiguration])],
  exports: [ExchangeConfigurationsService],
})
export class ExchangeConfigurationsModule {}
