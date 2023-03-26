import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExchangeConfiguration } from './exchange-configuration.entity';
import { ExchangeConfigurationDto } from './dto/exchange-configuration.dto';

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
    exchangeConfiguration: ExchangeConfigurationDto,
  ): Promise<ExchangeConfiguration> {
    return this.exchangeConfigurationRepository.save(exchangeConfiguration);
  }

  async update(
    id: number,
    exchangeConfiguration: ExchangeConfigurationDto,
  ): Promise<ExchangeConfiguration> {
    const foundExchange = await this.exchangeConfigurationRepository.findOneBy({
      id,
    });

    return this.exchangeConfigurationRepository.save(
      foundExchange.mapTo(exchangeConfiguration),
    );
  }

  async remove(id: number): Promise<void> {
    await this.exchangeConfigurationRepository.delete(id);
  }
}
