import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class ArgonService {
  async hash(data: string): Promise<string> {
    return argon2.hash(data);
  }

  async compare(hash: string, data: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, data);
    } catch (e) {
      return false;
    }
  }
}
