import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as userRepository from '../repositories/userRepository.js';
import sanitizeOutput from '../utils/sanitizeOutput.js';
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

const hashPassword = async password => await bcrypt.hash(password, 12);

export const prepareAccessAndRefreshToken = async userId => {
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId);

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

  sanitizeOutput(newUser);

  return newUser;
};
