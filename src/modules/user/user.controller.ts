import {
  Controller,
  Get,
  HttpStatus,
  HttpCode,
  Post,
  Body,
  ClassSerializerInterceptor,
  UseInterceptors,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';


import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';

@ApiTags('user')
@Controller('/')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOkResponse({ description: 'OK', type: [String] })
  // @ApiErrors(
  //   HttpStatus.UNAUTHORIZED,
  //   HttpStatus.FORBIDDEN,
  //   HttpStatus.NOT_FOUND,
  //   HttpStatus.INTERNAL_SERVER_ERROR,
  // )
  //@Permissions('user.get')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  @Get('/users')
  public getUsers() {
    return this.userService.getAllUsers();
  }

  @ApiOkResponse({ description: 'OK', type: [String] })
  // @ApiErrors(
  //   HttpStatus.UNAUTHORIZED,
  //   HttpStatus.FORBIDDEN,
  //   HttpStatus.NOT_FOUND,
  //   HttpStatus.INTERNAL_SERVER_ERROR,
  // )
  //@Permissions('user.get')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  @Get('/users')
  public getUserByAdress(@Param() adress:string) {
    return this.userService.getUsersByAdress(adress);
  }

  @ApiOkResponse({ description: 'OK', type: [String] })
  // @ApiErrors(
  //   HttpStatus.UNAUTHORIZED,
  //   HttpStatus.FORBIDDEN,
  //   HttpStatus.NOT_FOUND,
  //   HttpStatus.INTERNAL_SERVER_ERROR,
  // )
  //@Permissions('user.get')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  @Get('/users/:id')
  public getUserById(@Param('id') id:number) {
    return this.userService.getUsersById(id);
  }

  @ApiOkResponse({ description: 'OK', type: [String] })
  // @ApiErrors(
  //   HttpStatus.UNAUTHORIZED,
  //   HttpStatus.FORBIDDEN,
  //   HttpStatus.NOT_FOUND,
  //   HttpStatus.INTERNAL_SERVER_ERROR,
  // )
  //@Permissions('user.add')
  @HttpCode(HttpStatus.CREATED)
  @Post('/users')
  public addUser(@Body() user: UserDto) {
    return this.userService.addUser(user);
  }
}
