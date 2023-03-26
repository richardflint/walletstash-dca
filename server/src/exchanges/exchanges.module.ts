import { Module } from '@nestjs/common';
import { ExchangesService } from './exchanges.service';
import { SearchController } from './search.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExchangeMarket } from './exchange-market.entity';

@Module({
  providers: [ExchangesService],
  exports: [ExchangesService],
  imports: [TypeOrmModule.forFeature([ExchangeMarket])],
  controllers: [SearchController],
})
export class ExchangesModule {}
