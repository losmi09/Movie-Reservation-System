import prisma from '../server.js';

export const createUser = async userData =>
  await prisma.user.create({ data: userData });

export const findUserByEmail = async email =>
  await prisma.user.findUnique({ where: { email } });

export const setRefreshToken = async (userId, refreshToken) =>
  await prisma.user.update({ where: { id: userId }, data: { refreshToken } });
