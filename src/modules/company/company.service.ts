import { InjectQueue } from '@nestjs/bull';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Queue } from 'bull';
import { Model } from 'mongoose';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company, CompanyDocument } from './schemas/company.schema';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name)
    private readonly companyModel: Model<CompanyDocument>,

    @InjectQueue('invite-email')
    private readonly inviteEmailQueue: Queue,
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

  async findUserInCompany(userId: string, companyId: string) {
    return this.companyModel.findOne({
      _id: companyId,
      creator_id: userId,
    });
  }

  async invite(payload: CreateInviteCompany) {
    const { emails, companyId, userId } = payload;
    const userInCompany = await this.findUserInCompany(userId, companyId);

    if (!userInCompany) {
      throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED);
    }

    Promise.all(
      emails.map(async (email) => {
        const payloadInFile = {
          email,
          companyId,
        };

        await this.inviteEmailQueue.add(payloadInFile);
      }),
    );
  }
}

interface CreateInviteCompany {
  companyId: string;
  emails: string[];
  userId: string;
}
