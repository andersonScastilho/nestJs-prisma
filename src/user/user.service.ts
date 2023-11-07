import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create({ email, name, password }: CreateUserDto) {
    return this.prismaService.user.create({
      data: {
        email: email,
        name: name,
        password: password,
      },
    });
  }

  async index() {
    return this.prismaService.user.findMany();
  }

  async show(id: number) {
    return this.prismaService.user.findUnique({
      where: {
        id: id,
      },
    });
  }
}
