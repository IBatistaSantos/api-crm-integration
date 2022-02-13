import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { Company, CompanySchema } from './schemas/company.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { InviteCompany, InviteCompanySchema } from './schemas/invite.schema';
import { BullModule } from '@nestjs/bull';
import { InviteEmailProcessor } from './providers/consumers/invite-email.processor';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Company.name, schema: CompanySchema },
      { name: InviteCompany.name, schema: InviteCompanySchema },
    ]),

    BullModule.registerQueue({
      name: 'invite-email',
    }),
  ],
  controllers: [CompanyController],
  providers: [CompanyService, InviteEmailProcessor],
})
export class CompanyModule {}
