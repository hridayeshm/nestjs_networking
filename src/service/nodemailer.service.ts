import {Transporter, createTransport} from 'nodemailer'

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

   async sendVerficationMail(values: any){
     const mailOptions = {
       from: 'hridayesh@gmail.com',
       to: values.email, 
       subject: 'Verification Token',
       text: `Your Verification token: ${values.emailVerificationToken}`
     };
     await this.transporter.sendMail(mailOptions);
   }
 }
 
