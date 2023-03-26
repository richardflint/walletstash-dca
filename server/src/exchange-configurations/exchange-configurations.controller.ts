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
import { ExchangeConfigurationsService } from './exchange-configurations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ExchangeConfiguration } from './exchange-configuration.entity';

@Controller('exchange-configurations')
export class ExchangeConfigurationsController {
  constructor(
    private exchangeConfigurationsService: ExchangeConfigurationsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() exchangeConfiguration: ExchangeConfiguration) {
    return this.exchangeConfigurationsService.create(exchangeConfiguration);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<ExchangeConfiguration[]> {
    return this.exchangeConfigurationsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number): Promise<ExchangeConfiguration> {
    return this.exchangeConfigurationsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() exchangeConfiguration: ExchangeConfiguration,
  ) {
    return this.exchangeConfigurationsService.update(id, exchangeConfiguration);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.exchangeConfigurationsService.remove(id);
  }
}
