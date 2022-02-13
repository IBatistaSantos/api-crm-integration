import { MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { InjectModel } from '@nestjs/mongoose';
import { Job } from 'bull';
import { Model } from 'mongoose';
import { Company, CompanyDocument } from '../../schemas/company.schema';
import {
  InviteCompany,
  InviteCompanyDocument,
} from '../../schemas/invite.schema';

@Processor('invite-email')
export class InviteEmailProcessor {
  constructor(
    @InjectModel(Company.name)
    private readonly companyModel: Model<CompanyDocument>,
    @InjectModel(InviteCompany.name)
    private readonly inviteCompanyModel: Model<InviteCompanyDocument>,
    private readonly mailerService: MailerService,
  ) {}
  @Process()
  async sendInviteEmail(job: Job) {
    try {
      const { email, companyId } = job.data;

      const company = await this.companyModel.findById(companyId);

      if (!company) {
        throw new Error('Company not found');
      }

      const mail = {
        to: email,
        subject: 'Convite para o time',
        template: 'email-invite-company',
        context: {
          companyName: company.name,
          token: 'dgdgdg',
        },
      };

      const payload = {
        email,
        company_id: company.id,
      };

      const inviteAlreadySending = await this.inviteCompanyModel.find({
        company_id: company.id,
        email,
      });

      if (inviteAlreadySending.length > 0) {
        return;
      }

      const inviteCompanyDocument = await this.inviteCompanyModel.create(
        payload,
      );

      await this.mailerService.sendMail(mail);

      await inviteCompanyDocument.save();
    } catch (error) {
      console.log(error);
    }
  }
}
