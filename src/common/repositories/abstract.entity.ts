import uuidV4 from 'uuid/v4';

import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  BeforeInsert,
} from 'typeorm';

export abstract class AbstractEntity {
  @BeforeInsert()
  private generateId() {
    this.id = uuidV4();
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn() created: Date;
}
