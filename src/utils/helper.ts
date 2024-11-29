import crypto from 'crypto';
import prisma from "../db/db.config";
import nodemailer from 'nodemailer';
import { hashSync } from "bcrypt";
import { addMinutes } from 'date-fns';
import { generateEmailTemplate } from './mail';

export const generateRandomToken = (length: number): string => {
  return crypto.randomBytes(length).toString('hex');
};

export const generateOtp = () => {
  return new Promise((resolve) => {
    let otp = "";
    for (let i = 0; i < 4; i++) {
      const randVal = Math.round(Math.random() * 9);
      otp = otp + randVal;
    }
    resolve(otp);
  });
};


let config = {
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
};

export const sendOtp = async (email: string): Promise<{ success: boolean; message: string }> => {
  try {
    const otpToken = await prisma.otpToken.findFirst({
      where: { email: email },
    });

    if (otpToken && otpToken.expiresAt > new Date()) {
      return { success: false, message: 'OTP has already been sent to you!' };
    }

    if (otpToken && otpToken.expiresAt < new Date()) {
      await prisma.otpToken.delete({
        where: { email: email },
      });
    }

    const OTP:any =await generateOtp();
    const hashedOtp = hashSync(OTP, 10);
    const expiresAt = addMinutes(new Date(), 10);

    await prisma.otpToken.create({
      data: {
        email: email,
        token: hashedOtp,
        expiresAt: expiresAt,
      },
    });

    const transporter = nodemailer.createTransport(config);

    const message = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Verification Email',
      html: generateEmailTemplate(OTP),
    };

    await transporter.sendMail(message);

    return { success: true, message: 'Verification email has been sent.' };
  } catch (error) {
    console.error('Error sending OTP:', error);
    return { success: false, message: 'Error in sending email.' };
  }
};

export const generate_id=()=> {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';

  let id = '';

  for (let i = 0; i < 3; i++) {
    id += letters[Math.floor(Math.random() * letters.length)];
  }

  for (let i = 0; i < 4; i++) {
    id += digits[Math.floor(Math.random() * digits.length)];
  }

  id = id.split('').sort(() => Math.random() - 0.5).join('');
  return id;
}
