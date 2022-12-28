import { Column, Entity, OneToOne, JoinColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

import { AbstractEntity } from '@common/repositories/abstract.entity';

import { AddressEntity } from './address.entity';

@Entity('user')
export class UserEntity extends AbstractEntity {
  @Column() firstname: string;

  @Column() lastname: string;

  @Exclude()
  @Column()
  age: number;

  @OneToOne(() => AddressEntity, { cascade: true })
  @JoinColumn()
  address: AddressEntity;
}
