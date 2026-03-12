import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user/current-user.decorator';
import { Serialize } from 'src/interceptors/serialize/serialize.interceptor';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserDto } from './dtos/user.dto';
import { User } from './user.entity';
import { AuthGuard } from 'src/guards/auth/auth.guard';

@Controller('auth')
@Serialize(UserDto)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/me')
  @UseGuards(AuthGuard)
  async me(@CurrentUser() user: User) {
    if (!user) {
      throw new NotFoundException('user not found');
    }

    return user;
  }

  @Post('/signin')
  async signIn(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.findOne(body.email);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const isValidPass = await this.authService.isValidPassword(
      body.password,
      user.password,
    );

    if (!isValidPass) {
      return new BadRequestException('not valid password');
    }

    session.userId = user.id;
    return user;
  }

  @Post('/signup')
  async signUp(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.findOne(body.email);

    if (user) {
      throw new BadRequestException('user exists');
    }

    const newUser = await this.authService.create(body);
    session.userId = newUser.id;
    return newUser;
  }

  @Post('/signout')
  signOut(@Session() session: any) {
    session.userId = null;
    return true;
  }
}
