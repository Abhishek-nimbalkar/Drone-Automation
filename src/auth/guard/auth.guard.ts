import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from 'src/common/decorator/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  private jwtSecret: string;
  constructor(
    private jwtService: JwtService,
    configService: ConfigService,
    private reflector: Reflector,
  ) {
    this.jwtSecret = configService.get('JWT_SECRET');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      // 💡 See this condition
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    // console.log('token :>> ', token);
    if (!token) {
      throw new UnauthorizedException('Token Missing');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.jwtSecret,
      });

      request['user'] = payload;
    } catch (err) {
      throw new UnauthorizedException('Invalid Token');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
