import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

import { AddressDto } from './address.dto';

export class UserDto {
  @ApiProperty() @IsString() @IsNotEmpty() firstname: string;

  @ApiProperty() @IsString() lastName: string;

  @ApiProperty() @IsNumber() age: number;

  @ApiProperty({ type: [AddressDto] })
  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  @ApiProperty()
  address: AddressDto;
}
