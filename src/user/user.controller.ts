import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Patch,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';

import { CreateUserDto } from './dtos/create-user.dto';
import { UpdadePutUserDto } from './dtos/update-put-user.dto';
import { UpdadePatchUserDto } from './dtos/update-patch-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() { email, name, password }: CreateUserDto) {
    return this.userService.create({
      email: email,
      name: name,
      password: password,
    });
  }

  @Get()
  async index() {
    return this.userService.index();
  }

  @Get(':id')
  async show(@Param('id', ParseIntPipe) id: number) {
    return this.userService.show(id);
  }

  @Put(':id')
  async update(
    @Body() { email, name, password }: UpdadePutUserDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return {
      method: 'Put',
      email,
      name,
      password,
      id,
    };
  }

  @Patch(':id')
  async updatePartial(
    @Body() { email, name, password }: UpdadePatchUserDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return {
      method: 'Patch',
      email,
      name,
      password,
      id,
    };
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return {
      id,
    };
  }
}
