import prisma from '../server.js';

export const createUser = async userData =>
  await prisma.user.create({ data: userData });
