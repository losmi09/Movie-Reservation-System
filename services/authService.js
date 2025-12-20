import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as userRepository from '../repositories/userRepository.js';
import AppError from '../utils/appError.js';

const generateAccessToken = userId =>
  jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
    algorithm: 'HS256',
  });

const generateRefreshToken = userId =>
  jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
    algorithm: 'HS256',
  });

const verifyRefreshToken = async refreshToken => {
  try {
    const { id: userId } = await jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      { algorithms: ['HS256'] }
    );

    return userId;
  } catch (err) {
    if (err.name === 'TokenExpiredError')
      throw new AppError('Refresh token has expired', 400);

    throw new AppError('Invalid refresh token', 400);
  }
};

const hashPassword = async password => await bcrypt.hash(password, 12);

const hashToken = token =>
  crypto.createHash('sha256').update(token).digest('hex');

export const comparePasswords = async (password, userPassword) =>
  await bcrypt.compare(password, userPassword);

export const prepareAccessAndRefreshToken = async userId => {
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId);

  const hashedRefreshToken = hashToken(refreshToken);

  await userRepository.setRefreshToken(userId, hashedRefreshToken);

  return { accessToken, refreshToken };
};

export const register = async userData => {
  const { firstName, lastName, email, password } = userData;

  const hashedPassword = await hashPassword(password);

  const newUser = await userRepository.createUser({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  return newUser;
};

export const refreshToken = async token => {
  const userId = await verifyRefreshToken(token);

  const hashedRefreshToken = hashToken(token);

  const hackedUser = await userRepository.findUserByRefreshToken(
    userId,
    hashedRefreshToken
  );

  // Token reuse detected
  if (!hackedUser) {
    await userRepository.revokeRefreshToken(userId);
    throw new AppError('You cannot use the same refresh token twice', 403);
  }

  const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
    await prepareAccessAndRefreshToken(userId);

  return { newAccessToken, newRefreshToken };
};
