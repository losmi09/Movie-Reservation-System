import { prisma } from '../server.js';

const selectFields = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  photo: true,
  role: true,
};

export const createUser = async userData =>
  await prisma.user.create({ data: userData, select: selectFields });

export const updateUser = async (userId, data) =>
  await prisma.user.update({
    where: { id: userId },
    data,
    select: selectFields,
  });

export const findUserById = async (userId, additionaSelectFields) =>
  await prisma.user.findUnique({
    where: { id: userId },
    select: { ...selectFields, ...additionaSelectFields },
  });

export const findUserByEmail = async (email, additionaSelectFields) =>
  await prisma.user.findUnique({
    where: { email },
    select: { ...selectFields, ...additionaSelectFields },
  });

export const setEmailVerificationToken = async (userId, token) => {
  const VERIFICATION_TOKEN_EXPIRY = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  return await prisma.user.update({
    where: { id: userId },
    data: {
      emailVerificationToken: token,
      emailVerificationTokenExpiry: new Date(VERIFICATION_TOKEN_EXPIRY),
    },
    select: { id: true },
  });
};

export const findUserByVerificationToken = async token =>
  await prisma.user.findUnique({
    where: {
      emailVerificationToken: token,
      emailVerificationTokenExpiry: { gte: new Date() },
    },
    select: selectFields,
  });

export const setUserVerified = async userId =>
  await prisma.user.update({
    where: { id: userId },
    data: {
      isVerified: true,
      emailVerificationToken: null,
      emailVerificationTokenExpiry: null,
    },
    select: { id: true },
  });

export const setPasswordResetToken = async (email, passwordResetToken) => {
  const RESET_TOKEN_EXPIRY = Date.now() + 60 * 60 * 1000; // 1 hour

  await prisma.user.update({
    where: { email },
    data: {
      passwordResetToken,
      passwordResetTokenExpiry: new Date(RESET_TOKEN_EXPIRY),
    },
    select: { id: true },
  });
};

export const findUserByPasswordResetToken = async (
  passwordResetToken,
  additionaSelectFields,
) =>
  await prisma.user.findUnique({
    where: {
      passwordResetToken,
      passwordResetTokenExpiry: { gte: new Date() },
    },
    select: { ...selectFields, ...additionaSelectFields },
  });

export const clearPasswordResetToken = async email =>
  await prisma.user.update({
    where: { email },
    data: { passwordResetToken: null },
    select: { id: true },
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
    select: { id: true },
  });

export const deactivateUser = async userId =>
  await prisma.user.update({
    where: { id: userId },
    data: { isActive: false },
    select: { id: true },
  });

export const activateUser = async userId =>
  await prisma.user.update({
    where: { id: userId },
    data: { isActive: true },
    select: { id: true },
  });

export const isUserActive = async userId => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isActive: true },
  });

  return user?.isActive ?? false;
};

export const saveUserPhoto = async (userId, fileName) =>
  await prisma.user.update({
    where: { id: userId },
    data: { photo: fileName },
    select: selectFields,
  });
