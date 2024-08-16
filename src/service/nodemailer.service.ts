import {Transporter, createTransport} from 'nodemailer'
import { Otp } from 'src/otp/schema/otp.schema';
import { User } from 'src/user/schema/user.schema';

export class NodeMailerService{
   public transporter: Transporter
   constructor(){
     this.transporter = createTransport({
       host: "sandbox.smtp.mailtrap.io",
       port: 2525,
       auth: {
         user: 'c604d13959141c',
         pass: 'fefff4c7cb19f4' 
       }
     });
   }

   async sendVerficationMail(registeredUser: User, otp: string){
     const mailOptions = {
       from: 'hridayesh@gmail.com',
       to: registeredUser.email, 
       subject: 'Verification Token',
       text: `Your Verification token: ${otp}`
     };
     await this.transporter.sendMail(mailOptions);
   }
 }
 
