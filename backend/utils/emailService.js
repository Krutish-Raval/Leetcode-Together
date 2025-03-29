import nodemailer from 'nodemailer';
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  // service:"gmail",
  host:process.env.EMAIL_HOST,

    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    secure:false
  });
  
const sendEmail = async (to, subject, text) => {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER, 
        to, 
        subject,
        text,
      });
    //   console.log(`Email sent to ${to}`);
    } catch (error) {
      console.error(`Error sending email: ${error.message}`);
      throw new Error("Failed to send email. Please try again later.");
    }
  };

  export {sendEmail};