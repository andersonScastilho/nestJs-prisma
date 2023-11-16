import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UploadedFiles,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { AuthForgetDto } from './dto/auth-forget.dto';
import { AuthResetDto } from './dto/auth-reset.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/decorators/user.decorator';
import {
  FileInterceptor,
  FilesInterceptor,
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import { join } from 'path';
import { FileService } from 'src/file/file.service';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly fileService: FileService,
  ) {}
  @Post('login')
  async login(@Body() { email, password }: AuthLoginDto) {
    return await this.authService.login(email, password);
  }

  @Post('register')
  async register(@Body() body: AuthRegisterDto) {
    return await this.authService.register(body);
  }

  @Post('forget')
  async forget(@Body() { email }: AuthForgetDto) {
    return await this.authService.forget(email);
  }

  @Post('reset')
  async reset(@Body() { password, token }: AuthResetDto) {
    return await this.authService.reset(password, token);
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('photo')
  async uploadPhoto(
    @User() user,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: 'image/png',
          }),
          new MaxFileSizeValidator({
            maxSize: 1024 * 50,
          }),
        ],
      }),
    )
    photo: Express.Multer.File,
  ) {
    const path = join(
      __dirname,
      '..',
      '..',
      'storage',
      'photos',
      `photo-${user.id}.png`,
    );

    try {
      await this.fileService.upload(photo, path);
    } catch (e) {
      throw new BadRequestException(e);
    }

    return { success: true };
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('files'))
  @Post('files')
  async uploadFiles(
    @User() user,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    try {
      files.forEach(async (file, index) => {
        const personPath = join(
          __dirname,
          '..',
          '..',
          'storage',
          'photos',
          `photo-${user.id}-${index}.png`,
        );

        await this.fileService.upload(file, personPath);
      });
    } catch (e) {
      throw new BadRequestException(e);
    }

    return files;
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'photo', maxCount: 1 },
      { name: 'documents', maxCount: 10 },
    ]),
  )
  @Post('files-fields')
  async uploadFilesFields(
    @User() user,
    @UploadedFiles()
    files: { photo: Express.Multer.File; documents: Express.Multer.File[] },
  ) {
    const path = join(
      __dirname,
      '..',
      '..',
      'storage',
      'photos',
      `photo-${user.id}.png`,
    );

    try {
      await this.fileService.upload(files.photo, path);
    } catch (e) {
      throw new BadRequestException(e);
    }

    try {
      files.documents.forEach(async (document, index) => {
        const personPath = join(
          __dirname,
          '..',
          '..',
          'storage',
          'photos',
          `photo-${user.id}-${index}.png`,
        );

        await this.fileService.upload(document, personPath);
      });
    } catch (e) {
      throw new BadRequestException(e);
    }

    return files;
  }
}
