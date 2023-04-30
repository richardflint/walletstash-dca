import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExchangeConfigurationRequest } from './dto/exchange-configuration-request';
import { ExchangeConfiguration } from './exchange-configuration.entity';

@Injectable()
export class ExchangeConfigurationsService {
  constructor(
    @InjectRepository(ExchangeConfiguration)
    private exchangeConfigurationRepository: Repository<ExchangeConfiguration>,
  ) {}

  async findAll(): Promise<ExchangeConfiguration[]> {
    return this.exchangeConfigurationRepository.find();
  }

  async findOne(id: number): Promise<ExchangeConfiguration | undefined> {
    return this.exchangeConfigurationRepository.findOneBy({ id });
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
}
