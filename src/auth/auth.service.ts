import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  private readonly jwtSecret: string;
  private readonly jwtExpiration: string;
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.jwtSecret = this.configService.get('JWT_SECRET');
    this.jwtExpiration = this.configService.get('JWT_EXPIRATION');
  }
  async login(loginDto: LoginDto): Promise<any> {
    try {
      const user = await this.userService.findByEmail(loginDto.email);
      if (!user) throw new NotFoundException('User not found');
      if (user && (await bcrypt.compare(loginDto.password, user.password))) {
        const payload = { email: user.email, sub: user.id };
        const token = this.jwtService.sign(payload, {
          expiresIn: this.jwtExpiration,
          secret: this.jwtSecret,
        });
        return { success: true, token: 'Bearer ' + token, userId: user.id };
      }
      return { success: false, message: 'Invalid username or password' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async signUp(signUpData: SignUpDto): Promise<any> {
    try {
      const hashedPassword = await bcrypt.hash(signUpData.password, 10);
      signUpData.password = hashedPassword;
      const user = await this.userService.create(signUpData);
      return { success: true, user: user };
    } catch (error) {
      throw error;
    }
  }
}
