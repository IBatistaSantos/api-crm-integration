import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company, CompanyDocument } from './schemas/company.schema';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name)
    private readonly companyModel: Model<CompanyDocument>,
  ) {}
  async create(createCompanyDto: CreateCompanyDto) {
    const companyExists = await this.findByName(createCompanyDto.name);

    if (companyExists) {
      throw new HttpException('Company already exists', HttpStatus.BAD_REQUEST);
    }

    const createdCompany = await this.companyModel.create(createCompanyDto);
    return createdCompany.toObject();
  }

  async findAll(userId: string) {
    const companies = await this.companyModel.find({ creator_id: userId });
    return companies;
  }

  async findOne(id: string, userId: string) {
    const company = await this.companyModel.findOne({ id });

    if (company.creator_id.toString() !== userId.toString()) {
      throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED);
    }

    return company;
  }

  update(id: number, updateCompanyDto: UpdateCompanyDto) {
    return `This action updates a #${id} company`;
  }

  remove(id: number) {
    return `This action removes a #${id} company`;
  }

  async findByName(name: string) {
    return this.companyModel.findOne({
      name,
    });
  }
}
