import nodemailer from 'nodemailer';

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

const getEmailUrl = (path, token) =>
  `${process.env.HOST}/api/v1/auth/${path}/${token}`;

export const sendEmailVerification = async (user, verificationToken) => {
  const verificationUrl = getEmailUrl('verify-email', verificationToken);

  await sendEmail({
    to: user.email,
    subject: 'Email verification (valid for 24 hours)',
    text: `Please verify your email by opening this link: ${verificationUrl}.`,
  });
};

export const sendPasswordReset = async (email, resetToken) => {
  const resetUrl = getEmailUrl('reset-password', resetToken);

  await sendEmail({
    to: email,
    subject: 'Password reset (valid for 1 hour)',
    text: `Reset your password: ${resetUrl}.`,
  });
};
