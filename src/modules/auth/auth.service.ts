import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(createAuthDto: LoginDto): Promise<any> {
    const { email, password } = createAuthDto;
    const validateUser = await this.usersService.validateUser(email, password);

    if (!validateUser) {
      throw new Error('Invalid credentials');
    }

    const payload = { userId: validateUser._id.toString() };

    const user = {
      _id: validateUser._id,
      name: validateUser.name,
      email: validateUser.email,
      created_at: validateUser.created_at,
      is_active: validateUser.is_active,
    };

    return {
      user,
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(payload: any) {
    const { userId } = payload;

    return this.usersService.findOne(userId);
  }
}
