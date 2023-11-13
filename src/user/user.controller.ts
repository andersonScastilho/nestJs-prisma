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
  UseInterceptors,
} from '@nestjs/common';

import { CreateUserDto } from './dtos/create-user.dto';
import { UpdadePutUserDto } from './dtos/update-put-user.dto';
import { UpdadePatchUserDto } from './dtos/update-patch-user.dto';
import { UserService } from './user.service';
import { LogInterceptor } from 'src/interceptors/log.interceptor';
import { ParamId } from 'src/decorators/param-id.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(LogInterceptor)
  @Post()
  async create(@Body() { email, name, password, birth_at }: CreateUserDto) {
    return this.userService.create({
      email: email,
      name: name,
      password: password,
      birth_at: birth_at,
    });
  }

  @Get()
  async index() {
    return this.userService.index();
  }

  @Get(':id')

  //ParamId() = Decorator personalizado
  async show(@ParamId() id: number) {
    console.log(id);
    return this.userService.show(id);
  }

  @Put(':id')
  async update(
    @Body() { password, birth_at, email, name }: UpdadePutUserDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.userService.update(id, { password, birth_at, email, name });
  }

  @Patch(':id')
  async updatePartial(
    @Body() { password, birth_at, email, name }: UpdadePatchUserDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.userService.updatePartial(id, {
      password,
      birth_at,
      email,
      name,
    });
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id);
  }
}
