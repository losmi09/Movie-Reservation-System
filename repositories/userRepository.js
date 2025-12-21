import prisma from '../server.js';

export const createUser = async userData =>
  await prisma.user.create({ data: userData });

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
  const TOKEN_EXPIRY = Date.now() + 60 * 60 * 1000; // 1 hour

  return await prisma.user.update({
    where: { id: userId },
    data: {
      emailVerificationToken: token,
      emailVerificationTokenExpiry: new Date(TOKEN_EXPIRY),
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
