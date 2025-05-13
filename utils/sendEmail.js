import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,          // ✅ ex: "facterliapp@gmail.com"
    pass: process.env.EMAIL_PASSWORD  // ✅ mot de passe d'application
  },
});

const sendEmail = async (to, subject, text) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject,
    text,
  });
};

export default sendEmail;
