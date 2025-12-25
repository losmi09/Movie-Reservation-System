import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.js';
import * as userRepository from '../repositories/userRepository.js';
import * as emailService from '../services/emailService.js';
import { passwordSchema } from '../schemas/userSchema.js';
import sanitizeOutput from '../utils/sanitizeOutput.js';

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
      throw new AppError(`${tokenType} token has expired`, 401);

    throw new AppError(`Invalid ${tokenType} token`, 401);
  }
};

const hashPassword = async password => await bcrypt.hash(password, 12);

export const hashToken = token =>
  crypto.createHash('sha256').update(token).digest('hex');

export const createToken = () => {
  const token = crypto.randomBytes(32).toString('hex');
  const hashedToken = hashToken(token);
  return { token, hashedToken };
};

export const comparePasswords = async (password, userPassword) =>
  await bcrypt.compare(password, userPassword);

export const checkForPasswordChange = (JWTTimestamp, passwordChangeTimestamp) =>
  new Date(JWTTimestamp * 1000) < new Date(passwordChangeTimestamp);

const setPassword = async (userId, password) => {
  const hashedPassword = await hashPassword(password);

  await userRepository.updateUserPassword(userId, hashedPassword);
};

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

  const { token: verificationToken, hashedToken } = createToken();

  await userRepository.setEmailVerificationToken(newUser.id, hashedToken);

  await emailService.sendEmailVerification(newUser, verificationToken);

  return newUser;
};

export const login = async (email, password) => {
  const user = await userRepository.findUserByEmail(email);

  if (!user || !(await comparePasswords(password, user.password)))
    throw new AppError('Incorrect email or password', 401);

  return user;
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

export const verifyEmail = async token => {
  const hashedToken = hashToken(token);

  const user = await userRepository.findUserByVerificationToken(hashedToken);

  if (!user)
    throw new AppError('Verification token is invalid or has expired', 400);

  await userRepository.setUserVerified(user.id);

  sanitizeOutput(user);

  return user;
};

export const forgotPassword = async email => {
  try {
    const user = await userRepository.findUserByEmail(email);

    if (user) {
      const { token: resetToken, hashedToken } = createToken();

      await userRepository.setPasswordResetToken(email, hashedToken);

      await emailService.sendPasswordReset(email, resetToken);
    }
  } catch {
    await userRepository.clearPasswordResetToken(email);

    throw new AppError(
      'Password reset email failed. Please try again later',
      500
    );
  }
};

export const resetPassword = async (token, password, passwordConfirm) => {
  const hashedToken = hashToken(token);

  const user = await userRepository.findUserByPasswordResetToken(hashedToken);

  if (!user)
    throw new AppError('Password reset token is invalid or has expired', 400);

  const { error } = passwordSchema.validate(
    { passwordCurrent: user.password, password, passwordConfirm },
    { abortEarly: false }
  );

  if (error) throw error;

  setPassword(user.id, password);

  sanitizeOutput(user);

  return user;
};

export const updatePassword = async (userId, passwordCurrent, password) => {
  const user = await userRepository.findUserById(userId);

  if (!user) throw new AppError('User does no longer exist', 404);

  if (!(await comparePasswords(passwordCurrent, user.password)))
    throw new AppError('Your current password is incorrect', 401);

  setPassword(user.id, password);

  sanitizeOutput(user);

  return user;
};
