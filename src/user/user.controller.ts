import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Patch,
  Delete,
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
  async show(@Param() params) {
    return { user: params };
  }

  @Put(':id')
  async update(
    @Body() { email, name, password }: UpdadePutUserDto,
    @Param() params,
  ) {
    return {
      method: 'Put',
      email,
      name,
      password,
      params,
    };
  }

  @Patch(':id')
  async updatePartial(
    @Body() { email, name, password }: UpdadePatchUserDto,
    @Param() params,
  ) {
    return {
      method: 'Patch',
      email,
      name,
      password,
      params,
    };
  }

  @Delete(':id')
  async delete(@Param() params) {
    return {
      params,
    };
  }
}
