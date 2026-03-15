import crypto from 'crypto';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/appError.js';
import { passwordSchema } from '../schemas/userSchema.js';
import { sanitizeOutput } from '../utils/sanitizeOutput.js';
import * as userRepository from '../repositories/userRepository.js';
import * as emailService from '../services/emailService.js';
import * as redisService from '../services/redisService.js';

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

const hashPassword = async password => await argon2.hash(password);

export const hashToken = token =>
  crypto
    .createHmac('sha256', process.env.TOKEN_SECRET)
    .update(token)
    .digest('hex');

export const createToken = () => {
  const token = crypto.randomBytes(32).toString('hex');
  const hashedToken = hashToken(token);
  return { token, hashedToken };
};

export const comparePasswords = async (userPassword, providedPassword) =>
  await argon2.verify(userPassword, providedPassword);

export const checkForPasswordChange = (JWTTimestamp, passwordChangeTimestamp) =>
  new Date(JWTTimestamp * 1000) < new Date(passwordChangeTimestamp); // Multiply JWT timestamp by 1000 because it is in seconds and Date constructor expects milliseconds

const setPassword = async (userId, password) => {
  const hashedPassword = await hashPassword(password);

  await userRepository.updateUserPassword(userId, hashedPassword);
};

export const prepareAccessAndRefreshToken = async userId => {
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId);

  const hashedRefreshToken = hashToken(refreshToken);

  await redisService.setRefreshToken(userId, hashedRefreshToken);

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

export const login = async (email, providedPassword) => {
  const user = await userRepository.findUserByEmail(email, {
    password: true,
    isActive: true,
  });

  const DUMMY_HASH =
    '$argon2id$v=19$m=65536,t=3,p=4$G8NYSxrA+UMGHJbZVIXXXQ$UrHyBcYfCEms+92QVzGmfYqrWtH54WJY9FuROBQi/X8';

  // If no user is found with provided email, use dummy hash to prevent timing attack
  const userPassword = user?.password ?? DUMMY_HASH;

  if (!(await comparePasswords(userPassword, providedPassword)))
    throw new AppError('Incorrect email or password', 401);

  if (!user.isActive) await userRepository.activateUser(user.id);

  const sanitizedUser = sanitizeOutput(user);

  return sanitizedUser;
};

export const refreshToken = async token => {
  const { userId } = await verifyToken(token, 'refresh');

  const hashedRefreshToken = hashToken(token);

  const storedToken = await redisService.getRefreshToken(userId);

  // Prevent timming attack, even though it is currently impossible due to token rotation
  const isMatch = crypto.timingSafeEqual(
    Buffer.from(storedToken),
    Buffer.from(hashedRefreshToken),
  );

  // Token reuse detected
  if (!isMatch) {
    await redisService.revokeRefreshToken(userId);
    throw new AppError('Invalid refresh token', 401);
  }

  const isUserActive = await userRepository.isUserActive(userId);

  if (!isUserActive) throw new AppError('Your account is deactivated', 403);

  const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
    await prepareAccessAndRefreshToken(userId);

  return { newAccessToken, newRefreshToken };
};

export const protect = async accessToken => {
  const { userId, issuedAt } = await verifyToken(accessToken, 'access');

  const user = await userRepository.findUserById(userId, {
    passwordChangedAt: true,
  });

  if (!user)
    throw new AppError('The user belonging to token does no longer exist', 401);

  if (checkForPasswordChange(issuedAt, user.passwordChangedAt))
    throw new AppError('Password was changed. Please log in again', 401);

  const sanitizedUser = sanitizeOutput(user);

  return sanitizedUser;
};

export const verifyEmail = async token => {
  const hashedToken = hashToken(token);

  const user = await userRepository.findUserByVerificationToken(hashedToken);

  if (!user)
    throw new AppError('Verification token is invalid or has expired', 400);

  await userRepository.setUserVerified(user.id);

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
      500,
    );
  }
};

export const resetPassword = async (token, newPassword, passwordConfirm) => {
  const hashedToken = hashToken(token);

  const user = await userRepository.findUserByPasswordResetToken(hashedToken, {
    password: true,
  });

  if (!user)
    throw new AppError('Password reset token is invalid or has expired', 400);

  // Default to some random string so passwordSchema validation won't throw an error that passwordCurrent is required. It checks if new password is not the same as current
  let passwordCurrent = 'somestring';

  // Ensure that new password is not the same as current one
  if (await comparePasswords(user.password, String(newPassword)))
    passwordCurrent = newPassword;

  const { error } = passwordSchema.validate(
    { passwordCurrent, password: newPassword, passwordConfirm },
    { abortEarly: false },
  );

  if (error) throw error;

  await setPassword(user.id, newPassword);

  const sanitizedUser = sanitizeOutput(user);

  return sanitizedUser;
};

export const updatePassword = async (userId, passwordCurrent, newPassword) => {
  const user = await userRepository.findUserById(userId, { password: true });

  if (!user) throw new AppError('User does no longer exist', 404);

  if (!(await comparePasswords(user.password, passwordCurrent)))
    throw new AppError('Your current password is incorrect', 401);

  await setPassword(user.id, newPassword);

  const sanitizedUser = sanitizeOutput(user);

  return sanitizedUser;
};
