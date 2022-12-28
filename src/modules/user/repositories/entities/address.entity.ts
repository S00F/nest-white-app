import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '@common/repositories/abstract.entity';

@Entity('address')
export class AddressEntity extends AbstractEntity {
  @Column() addressLine1: string;
  @Column() zipCode: string;
  @Column() city: string;
  @Column() country: string;
}
