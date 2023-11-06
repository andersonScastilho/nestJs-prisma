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

@Controller('users')
export class UserController {
  @Post()
  async create(@Body() { email, name, password }: CreateUserDto) {
    return { email, name, password };
  }

  @Get()
  async index() {
    return { users: [] };
  }

  @Get(':id')
  async show(@Param('id', ParseIntPipe) id: number) {
    return { userId: id };
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
