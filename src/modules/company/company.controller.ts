import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/shared/decorator/get-user.decorator';
import { Role } from 'src/shared/decorator/role.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { User } from '../users/schemas/user.schema';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Controller('company')
@Role('admin')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@GetUser() user: User, @Body() createCompanyDto: CreateCompanyDto) {
    const payload = { ...createCompanyDto, creator_id: user._id };
    return this.companyService.create(payload);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  findAll(@GetUser() user: User) {
    return this.companyService.findAll(user._id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  findOne(@GetUser() user: User, @Param('id') id: string) {
    return this.companyService.findOne(id, user._id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    const payload: UpdateCompanyDto = {
      id,
      userId: user._id,
      name: updateCompanyDto.name,
    };
    return this.companyService.update(payload);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@GetUser() user: User, @Param('id') id: string) {
    return this.companyService.remove(id, user._id);
  }
}
