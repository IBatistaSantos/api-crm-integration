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

  async update({ id, userId, name }: UpdateCompanyDto) {
    const company = await this.findOne(id, userId);

    const companyExists = await this.findByName(name);

    if (companyExists) {
      throw new HttpException('Company already exists', HttpStatus.BAD_REQUEST);
    }

    company.name = name;
    await company.save();

    return company;
  }

  async remove(id: string, userId: string) {
    const company = await this.findOne(id, userId);

    await company.remove();
  }

  async findByName(name: string) {
    return this.companyModel.findOne({
      name,
    });
  }
}
