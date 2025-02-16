import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

export async function sendEmail(to: string, subject: string, text: string) {
  console.log(to,subject,text)
  let info = await transporter.sendMail({
    from: `"Image App" <${ process.env.MAIL_USER}>`, 
    to: to, 
    subject: subject,
    text: text,
    html: `<b>${text}</b>`, 
  });

  console.log("Message sent: %s", info.messageId);
}
