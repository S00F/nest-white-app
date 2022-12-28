import {
  Controller,
  Get,
  HttpStatus,
  HttpCode,
  Post,
  Body,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';


import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';

@ApiTags('user')
@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOkResponse({ description: 'OK', type: [String] })
  @ApiErrors(
    HttpStatus.UNAUTHORIZED,
    HttpStatus.FORBIDDEN,
    HttpStatus.NOT_FOUND,
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  //@Permissions('user.get')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  @Get('/')
  public getUsers() {
    return this.userService.getUsers();
  }

  @ApiOkResponse({ description: 'OK', type: [String] })
  @ApiErrors(
    HttpStatus.UNAUTHORIZED,
    HttpStatus.FORBIDDEN,
    HttpStatus.NOT_FOUND,
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  //@Permissions('user.add')
  @HttpCode(HttpStatus.CREATED)
  @Post('/')
  public addUser(@Body() user: UserDto) {
    return this.userService.addUser(user);
  }
}
