import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ExchangeConfiguration } from './exchange-configuration.entity';

@Entity()
export class Conversion {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'datetime' })
  datetime: Date;
  @Column()
  externalId: string;
  @Column()
  symbol: string;
  @Column()
  amount: number;
  @ManyToOne(
    () => ExchangeConfiguration,
    (configuration) => configuration.conversions,
  )
  configuration: ExchangeConfiguration;
}
