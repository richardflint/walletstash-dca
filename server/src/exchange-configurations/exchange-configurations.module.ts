import { Module } from '@nestjs/common';
import { ExchangeConfigurationsController } from './exchange-configurations.controller';
import { ExchangeConfigurationsService } from './exchange-configurations.service';
import { ExchangeConfiguration } from './exchange-configuration.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversion } from './conversion.entity';

@Module({
  controllers: [ExchangeConfigurationsController],
  providers: [ExchangeConfigurationsService],
  imports: [TypeOrmModule.forFeature([ExchangeConfiguration, Conversion])],
  exports: [ExchangeConfigurationsService],
})
export class ExchangeConfigurationsModule {}
