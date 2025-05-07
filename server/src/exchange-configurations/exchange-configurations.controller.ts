import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ExchangeConfigurationRequest } from './dto/exchange-configuration-request';
import {
  ConversionResponse,
  ExchangeConfigurationResponse,
} from './dto/exchange-configuration-response';
import { ExchangeConfigurationsService } from './exchange-configurations.service';

@Controller('exchange-configurations')
export class ExchangeConfigurationsController {
  constructor(
    private exchangeConfigurationsService: ExchangeConfigurationsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() exchangeConfiguration: ExchangeConfigurationRequest,
  ): Promise<ExchangeConfigurationResponse> {
    const configuration = await this.exchangeConfigurationsService.create(
      exchangeConfiguration,
    );
    return {
      ...configuration,
      latestConversion: {
        ...configuration.getLatestConversion,
      } as ConversionResponse,
    } as ExchangeConfigurationResponse;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<ExchangeConfigurationResponse[]> {
    return await (
      await this.exchangeConfigurationsService.findAll()
    ).map(
      (configuration) =>
        ({
          ...configuration,
          latestConversion: {
            ...configuration.getLatestConversion,
          } as ConversionResponse,
        } as ExchangeConfigurationResponse),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(
    @Param('id') id: number,
  ): Promise<ExchangeConfigurationResponse> {
    const configuration = await this.exchangeConfigurationsService.findOne(id);
    console.log(configuration.conversions);
    return {
      ...configuration,
      latestConversion: {
        ...configuration.getLatestConversion,
      } as ConversionResponse,
    } as ExchangeConfigurationResponse;
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() exchangeConfiguration: ExchangeConfigurationRequest,
  ): Promise<ExchangeConfigurationResponse> {
    const configuration = await this.exchangeConfigurationsService.update(
      id,
      exchangeConfiguration,
    );
    return {
      ...configuration,
      latestConversion: {
        ...configuration.getLatestConversion,
      } as ConversionResponse,
    } as ExchangeConfigurationResponse;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.exchangeConfigurationsService.remove(id);
  }
}
