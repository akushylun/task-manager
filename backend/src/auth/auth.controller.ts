import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Session,
  UnauthorizedException,
} from '@nestjs/common';
import { CurrentUser } from '../decorators/current-user/current-user.decorator';
import { Public } from '../decorators/public/public.decorator';
import { Serialize } from '../interceptors/serialize/serialize.interceptor';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserDto } from './dtos/user.dto';
import { User } from './user.entity';
import { ApiCookieAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
// `AppSession` must be a type-only import: with isolatedModules +
// emitDecoratorMetadata, a type used in a decorated signature cannot come from
// a value import (TS1272).
import type { AppSession } from './session';
import { destroySession } from './session';

@ApiTags('auth')
@Controller('auth')
@Serialize(UserDto)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse({ type: UserDto })
  @Get('/me')
  async me(@CurrentUser() user: User) {
    if (!user) {
      throw new UnauthorizedException('invalid credentials');
    }

    return user;
  }

  @Public()
  @Post('/signin')
  async signIn(@Body() body: CreateUserDto, @Session() session: AppSession) {
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
  async signUp(@Body() body: CreateUserDto, @Session() session: AppSession) {
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
  async signOut(@Session() session: AppSession) {
    // destroy() DELs the key in Redis. Assigning `userId = null` only emptied
    // the session and left it in the store until its TTL expired — and, since
    // that counts as a modification, refreshed the TTL on the way out.
    await destroySession(session);
    return true;
  }
}
