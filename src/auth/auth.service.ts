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
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer/dist';
@Injectable()
export class AuthService {
  private readonly audience = 'users';
  private readonly issuer = 'login';

  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
  ) {}

  createToken(user: User) {
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

  checarToken(token: string) {
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
      },
    });

    if (!user) {
      throw new UnauthorizedException('Email e/ou senha incorreto');
    }

    const isMatchPassword = await bcrypt.compare(password, user.password);

    if (!isMatchPassword) {
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

    const token = this.jwtService.sign(
      {
        id: user.id,
      },
      {
        expiresIn: '5 minutes',
        subject: String(user.id),
        audience: this.audience,
        issuer: 'forget',
      },
    );

    await this.mailerService.sendMail({
      subject: 'Recuperação de senha',
      to: email,
      html: `<!DOCTYPE html>
      <html lang="pt-br">
        <head>
          <title>Título da página</title>
          <meta charset="utf-8">
        </head>
        <body>
        p ${user.name}você solicitou a recuperação de senha, por favor use o token a seguir: <a href='${token}'>${token}<a>
      
        </body>
      </html>`,
    });

    return true;
  }

  async reset(password: string, token: string) {
    try {
      const { id } = this.jwtService.verify<{ id: number }>(token, {
        audience: this.audience,
        issuer: 'forget',
      });

      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);

      const user = await this.prismaService.user.update({
        where: {
          id: id,
        },
        data: {
          password: passwordHash,
        },
      });

      return this.createToken(user);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async register(data: AuthRegisterDto) {
    const user = await this.userService.create(data);

    return this.createToken(user);
  }

  isValidToken(token: string) {
    try {
      this.checarToken(token);

      return true;
    } catch (e) {
      return false;
    }
  }
}
