import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { BcryptjsProvider } from './providers/bcrypt/implementation/bcrypt.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'IBcryptProvider',
      useClass: BcryptjsProvider,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
