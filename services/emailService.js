import crypto from 'crypto';
import nodemailer from 'nodemailer';
import * as authService from './authService.js';
import * as userRepository from '../repositories/userRepository.js';

export const sendEmail = async options => {
  const { to, subject, text } = options;

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: 'John Smith <john@hotmail.com>',
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
};

export const sendEmailVerification = async user => {
  const verificationToken = crypto.randomBytes(32).toString('hex');

  const verificationUrl = `${process.env.HOST}/api/v1/auth/verify-email/${verificationToken}`;

  const hashedToken = authService.hashToken(verificationToken);

  await userRepository.setEmailVerificationToken(user.id, hashedToken);

  await sendEmail({
    to: user.email,
    subject: 'Email verification (valid for 1 hour)',
    text: `Please verify your email by opening this link: ${verificationUrl}.`,
  });
};
