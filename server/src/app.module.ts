import { Logger, Module } from '@nestjs/common';
import { ExchangesModule } from './exchanges/exchanges.module';
import { ExchangeConfigurationsModule } from './exchange-configurations/exchange-configurations.module';
import { ScheduleModule } from '@nestjs/schedule';
import { DcaModule } from './dca/dca.module';
import { WinstonModule } from 'nest-winston';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './data-source';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    ScheduleModule.forRoot(),
    ExchangesModule,
    ExchangeConfigurationsModule,
    DcaModule,
    WinstonModule.forRoot({
      // options
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [Logger],
})
export class AppModule {}
