import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddressDto {
  @ApiProperty() @IsString() addressLine1: string;
  @ApiProperty() @IsString() zipCode: string;
  @ApiProperty() @IsString() city: string;
  @ApiProperty() @IsString() country: string;
}
