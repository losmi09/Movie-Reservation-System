import prisma from '../server.js';

export const createUser = async userData =>
  await prisma.user.create({ data: userData });

export const updateUser = async (userId, data) =>
  await prisma.user.update({ where: { id: userId }, data });

export const findUserById = async userId =>
  await prisma.user.findUnique({ where: { id: userId } });

export const findUserByEmail = async email =>
  await prisma.user.findUnique({ where: { email } });

export const setRefreshToken = async (userId, refreshToken) =>
  await prisma.user.update({ where: { id: userId }, data: { refreshToken } });

export const findUserByRefreshToken = async (userId, refreshToken) =>
  await prisma.user.findUnique({ where: { id: userId, refreshToken } });

export const revokeRefreshToken = async userId =>
  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null },
  });

export const setEmailVerificationToken = async (userId, token) => {
  const VERIFICATION_TOKEN_EXPIRY = Date.now() + 86400000; // 24 hours

  return await prisma.user.update({
    where: { id: userId },
    data: {
      emailVerificationToken: token,
      emailVerificationTokenExpiry: new Date(VERIFICATION_TOKEN_EXPIRY),
    },
  });
};

export const findUserByVerificationToken = async token =>
  await prisma.user.findUnique({
    where: {
      emailVerificationToken: token,
      emailVerificationTokenExpiry: { gte: new Date() },
    },
  });

export const setUserVerified = async userId =>
  await prisma.user.update({
    where: { id: userId },
    data: {
      isVerified: true,
      emailVerificationToken: null,
      emailVerificationTokenExpiry: null,
    },
  });

export const setPasswordResetToken = async (email, passwordResetToken) => {
  const RESET_TOKEN_EXPIRY = Date.now() + 60 * 60 * 1000; // 1 hour

  await prisma.user.update({
    where: { email },
    data: {
      passwordResetToken,
      passwordResetTokenExpiry: new Date(RESET_TOKEN_EXPIRY),
    },
  });
};

export const findUserByPasswordResetToken = async passwordResetToken =>
  await prisma.user.findUnique({
    where: {
      passwordResetToken,
      passwordResetTokenExpiry: { gte: new Date() },
    },
  });

export const clearPasswordResetToken = async email =>
  await prisma.user.update({
    where: { email },
    data: { passwordResetToken: null },
  });

export const updateUserPassword = async (userId, newPassword) =>
  await prisma.user.update({
    where: { id: userId },
    data: {
      password: newPassword,
      passwordChangedAt: new Date(),
      passwordResetToken: null,
      passwordResetTokenExpiry: null,
    },
  });

export const deactivateUser = async userId =>
  await prisma.user.update({
    where: { id: userId },
    data: { isActive: false },
  });

export const activateUser = async userId =>
  await prisma.user.update({ where: { id: userId }, data: { isActive: true } });

export const saveUserPhoto = async (userId, fileName) =>
  await prisma.user.update({
    where: { id: userId },
    data: { photo: fileName },
  });
