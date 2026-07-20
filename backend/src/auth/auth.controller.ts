import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Session,
  UnauthorizedException,
} from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user/current-user.decorator';
import { Public } from 'src/decorators/public/public.decorator';
import { Serialize } from 'src/interceptors/serialize/serialize.interceptor';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserDto } from './dtos/user.dto';
import { User } from './user.entity';

@Controller('auth')
@Serialize(UserDto)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/me')
  async me(@CurrentUser() user: User) {
    if (!user) {
      throw new UnauthorizedException('invalid credentials');
    }

    return user;
  }

  @Public()
  @Post('/signin')
  async signIn(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.findOne(body.email);

    if (!user) {
      throw new UnauthorizedException('invalid credentials');
    }

    const isValidPass = await this.authService.isValidPassword(
      body.password,
      user.password,
    );

    if (!isValidPass) {
      throw new UnauthorizedException('invalid credentials');
    }

    session.userId = user.id;
    return user;
  }

  @Public()
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

  @Public()
  @Post('/signout')
  signOut(@Session() session: any) {
    session.userId = null;
    return true;
  }
}
