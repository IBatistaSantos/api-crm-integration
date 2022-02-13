import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('invite-email')
export class InviteEmailProcessor {
  @Process()
  async sendInviteEmail(job: Job) {
    console.log(job.data);
  }
}
