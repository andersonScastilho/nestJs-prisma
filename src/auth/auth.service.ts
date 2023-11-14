import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { UserService } from 'src/user/user.service';
@Injectable()
export class AuthService {
  private readonly audience: 'users';
  private readonly issuer: 'login';

  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
  ) {}

  async createToken(user: User) {
    return {
      acessToken: this.jwtService.sign(
        {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        {
          expiresIn: '7 days',
          subject: String(user.id),
          audience: this.audience,
          issuer: this.issuer,
        },
      ),
    };
  }

  async checarToken(token: string) {
    try {
      const data = this.jwtService.verify(token, {
        audience: this.audience,
        issuer: this.issuer,
      });

      return data;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async login(email: string, password: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        email: email,
        password: password,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Email e/ou senha incorreto');
    }

    return this.createToken(user);
  }

  async forget(email: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Email está incorreto');
    }
  }

  async reset(password: string, token: string) {
    const id = 0;

    const user = await this.prismaService.user.update({
      where: {
        id: id,
      },
      data: {
        password: password,
      },
    });

    return this.createToken(user);
  }

  async register(data: AuthRegisterDto) {
    const user = await this.userService.create(data);

    return this.createToken(user);
  }

  async isValidToken(token: string) {
    try {
      this.checarToken(token);

      return true;
    } catch (e) {
      return false;
    }
  }
}
