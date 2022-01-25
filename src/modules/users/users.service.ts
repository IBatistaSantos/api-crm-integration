import {
  ConflictException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IIBcryptProvider } from './providers/bcrypt/interfaces/IBcryptProvider';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @Inject('IBcryptProvider')
    private readonly bcryptProvider: IIBcryptProvider,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.findByEmail(createUserDto.email);

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await this.bcryptProvider.hash(
      createUserDto.password,
    );

    const createdUser: CreateUserDto = {
      name: createUserDto.name,
      email: createUserDto.email,
      password: hashedPassword,
      role: createUserDto.role,
    };

    const newUser = await this.userModel.create(createdUser);
    const user = newUser.toObject();

    delete user.password;
    return user;
  }

  async findAll(): Promise<User[]> {
    const users = await this.userModel.find({
      is_active: true,
    });

    return users.map((user) => {
      const userObject = user.toObject();
      delete userObject.password;
      return userObject;
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById({ _id: id });
    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const userExists = await this.userModel.findByIdAndUpdate(
      id,
      updateUserDto,
    );

    if (!userExists) {
      throw new ConflictException('User not found');
    }
  }

  async disableUser(id: string) {
    const user = await this.userModel.findById({ _id: id });

    user.is_active = false;

    await user.save();
  }

  async activeUser(id: string) {
    const user = await this.userModel.findById({ _id: id });
    user.is_active = true;

    await user.save();
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.userModel.findOne({ email });
    return user;
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);

    if (user && (await this.bcryptProvider.compare(password, user.password))) {
      delete user.password;
      return user;
    }

    throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
  }
}
