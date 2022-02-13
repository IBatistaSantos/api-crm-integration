import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'path';

console.log();

const mailerConfig: MailerOptions = {
  transport: {
    host: 'smtp.mailtrap.io',
    secure: false,
    port: 2525,
    auth: {
      user: 'caec286771bd47',
      pass: 'e95bdb1c560ebd',
    },
  },
  defaults: {
    from: '"No Reply" <noreply@example.com>',
  },
  template: {
    dir: path.resolve(__dirname, '..', 'mail', 'templates'),
    adapter: new HandlebarsAdapter(),
    options: {
      extName: '.hbs',
      layoutsDir: path.resolve(__dirname, '..', 'mail', 'templates'),
    },
  },
};

export { mailerConfig };
