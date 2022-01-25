import { Injectable } from '@nestjs/common';
import { IIBcryptProvider } from '../interfaces/IBcryptProvider';
import * as bcrypt from 'bcryptjs';
@Injectable()
class BcryptjsProvider implements IIBcryptProvider {
  async hash(password: string): Promise<string> {
    const saltOrRounds = 10;
    return bcrypt.hash(password, saltOrRounds);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
  }
}

export { BcryptjsProvider };
