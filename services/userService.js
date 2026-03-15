import * as userRepository from '../repositories/userRepository.js';

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};

  Object.keys(obj).forEach(field => {
    if (allowedFields.includes(field)) newObj[field] = obj[field];
  });

  return newObj;
};

export const getCurrentUser = async userId =>
  await userRepository.findUserById(userId, { createdAt: true });

export const updateCurrentUser = async (userId, data) => {
  const filteredData = filterObj(data, 'firstName', 'lastName', 'email');

  return await userRepository.updateUser(userId, filteredData);
};

export const deactivateCurrentUser = async userId => {
  const isUserActive = await userRepository.isUserActive(userId);

  if (!isUserActive) return;

  await userRepository.deactivateUser(userId);
};

export const saveUserPhoto = async (userId, fileName) =>
  await userRepository.saveUserPhoto(userId, fileName);
