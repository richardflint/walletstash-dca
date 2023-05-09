import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversion } from './conversion.entity';
import { ExchangeConfigurationRequest } from './dto/exchange-configuration-request';
import { ExchangeConfiguration } from './exchange-configuration.entity';

@Injectable()
export class ExchangeConfigurationsService {
  constructor(
    @InjectRepository(ExchangeConfiguration)
    private exchangeConfigurationRepository: Repository<ExchangeConfiguration>,
    @InjectRepository(Conversion)
    private conversionRepository: Repository<Conversion>,
  ) {}

  async findAll(): Promise<ExchangeConfiguration[]> {
    return this.exchangeConfigurationRepository.find({
      relations: {
        conversions: true,
      },
    });
  }

  async findOne(id: number): Promise<ExchangeConfiguration | undefined> {
    return this.exchangeConfigurationRepository.findOne({
      where: {
        id,
      },
      relations: {
        conversions: true,
      },
    });
  }

  async create(
    exchangeConfiguration: ExchangeConfigurationRequest,
  ): Promise<ExchangeConfiguration> {
    const newConfiguration = {
      ...exchangeConfiguration,
    } as ExchangeConfiguration;
    return this.exchangeConfigurationRepository.save(newConfiguration);
  }

  async update(
    id: number,
    exchangeConfiguration: ExchangeConfigurationRequest,
  ): Promise<ExchangeConfiguration> {
    const foundExchange = await this.exchangeConfigurationRepository.findOneBy({
      id,
    });

    if (foundExchange == null) {
      return null;
    }

    return this.exchangeConfigurationRepository.save(
      foundExchange.mapTo(exchangeConfiguration),
    );
  }

  async remove(id: number): Promise<void> {
    const foundExchange = await this.exchangeConfigurationRepository.findOneBy({
      id,
    });

    if (foundExchange == null) {
      return null;
    }

    await this.exchangeConfigurationRepository.delete(id);
  }

  async addConversion(
    configurationId: number,
    datetime: Date,
    externalId: string,
    symbol: string,
    amount: number,
  ): Promise<void> {
    const configuration = await this.exchangeConfigurationRepository.findOneBy({
      id: configurationId,
    });

    if (configuration) {
      const conversion = {
        datetime,
        externalId,
        symbol,
        amount,
        configuration,
      } as Conversion;

      if (configuration.conversions) {
        configuration.conversions.push(conversion);
      } else {
        configuration.conversions = [conversion];
      }
      await this.conversionRepository.save(conversion);
      await this.exchangeConfigurationRepository.save(configuration);
    }
  }
}
