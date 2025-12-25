import AppError from '../utils/appError.js';
import { comparePasswords } from './authService.js';
import sanitizeOutput from '../utils/sanitizeOutput.js';
import * as userRepository from '../repositories/userRepository.js';

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(field => {
    if (allowedFields.includes(field)) newObj[field] = obj[field];
  });
  return newObj;
};

export const getCurrentUser = async userId => {
  const currentUser = await userRepository.findUserById(userId);

  sanitizeOutput(currentUser);

  return currentUser;
};

export const updateCurrentUser = async (userId, data) => {
  const filteredData = filterObj(data, 'firstName', 'lastName', 'email');

  const updatedUser = await userRepository.updateUser(userId, filteredData);

  return updatedUser;
};

export const deactivateCurrentUser = async (userId, password) => {
  const user = await userRepository.findUserById(userId);

  if (!user) throw new AppError('User does no longer exist', 404);

  if (!user.isActive) return;

  if (!(await comparePasswords(password, user.password)))
    throw new AppError('Your current password is incorrect', 401);

  await userRepository.deactivateUser(userId);
};
