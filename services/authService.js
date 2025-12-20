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

const verifyToken = async (token, tokenType) => {
  try {
    const secret =
      tokenType === 'access'
        ? process.env.ACCESS_TOKEN_SECRET
        : process.env.REFRESH_TOKEN_SECRET;

    const { id: userId, iat: issuedAt } = await jwt.verify(token, secret, {
      algorithms: ['HS256'],
    });

    return { userId, issuedAt };
  } catch (err) {
    if (err.name === 'TokenExpiredError')
      throw new AppError(`${tokenType} token has expired`, 400);

    throw new AppError(`Invalid ${tokenType} token`, 400);
  }
};

const hashPassword = async password => await bcrypt.hash(password, 12);

const hashToken = token =>
  crypto.createHash('sha256').update(token).digest('hex');

export const comparePasswords = async (password, userPassword) =>
  await bcrypt.compare(password, userPassword);

export const checkForPasswordChange = (JWTTimestamp, passwordChangeTimestamp) =>
  JWTTimestamp * 1000 <
  new Date(passwordChangeTimestamp - 2 * 60 * 60 * 1000).getTime();

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
  const { userId } = await verifyToken(token, 'refresh');

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

export const protect = async accessToken => {
  const { userId, issuedAt } = await verifyToken(accessToken, 'access');

  const user = await userRepository.findUserById(userId);

  if (!user)
    throw new AppError('The user belonging to token does no longer exist', 401);

  if (checkForPasswordChange(issuedAt, user.passwordChangedAt))
    throw new AppError('Password was changed. Please log in again', 401);

  return user;
};
