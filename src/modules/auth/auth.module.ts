import { Module } from '@nestjs/common';
import { AuthCommand } from './authCommand';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [AuthCommand],
  providers: [AuthService],
})
export class AuthModule {}
