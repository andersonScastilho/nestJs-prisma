import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdadePatchUserDto } from './dtos/update-patch-user.dto';
import { UpdadePutUserDto } from './dtos/update-put-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreateUserDto) {
    const salt = await bcrypt.genSalt();

    data.password = await bcrypt.hash(data.password, salt);

    return this.prismaService.user.create({
      data: data,
    });
  }

  async index() {
    return this.prismaService.user.findMany();
  }

  async show(id: number) {
    await this.exists(id);

    return this.prismaService.user.findUnique({
      where: {
        id: id,
      },
    });
  }

  async update(
    id: number,
    { birth_at, email, name, password, role }: UpdadePutUserDto,
  ) {
    await this.exists(id);

    const salt = await bcrypt.genSalt();

    password = await bcrypt.hash(password, salt);

    return this.prismaService.user.update({
      where: {
        id: id,
      },
      data: {
        email,
        name,
        password,
        birth_at: birth_at ? new Date(birth_at) : null,
        role: role,
      },
    });
  }

  async updatePartial(
    id: number,
    { birth_at, email, name, password, role }: UpdadePatchUserDto,
  ) {
    await this.exists(id);

    const data: any = {};

    if (email) {
      data.email = email;
    }

    if (birth_at) {
      data.birth_at = new Date(birth_at);
    }

    if (name) {
      data.name = name;
    }

    if (password) {
      const salt = await bcrypt.genSalt();

      data.password = await bcrypt.hash(data.password, salt);
    }

    if (role) {
      data.role = role;
    }

    return this.prismaService.user.update({
      where: {
        id: id,
      },
      data,
    });
  }

  async delete(id: number) {
    await this.exists(id);

    return this.prismaService.user.delete({
      where: {
        id: id,
      },
    });
  }

  async exists(id: number) {
    if (
      !(await this.prismaService.user.count({
        where: {
          id: id,
        },
      }))
    ) {
      throw new NotFoundException(`O usuario ${id} não`);
    }
  }
}
