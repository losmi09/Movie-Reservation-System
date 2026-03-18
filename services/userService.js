import * as userRepository from '../repositories/userRepository.js';

export const getCurrentUser = async userId =>
  await userRepository.findUserById(userId, { createdAt: true });

export const updateCurrentUser = async (userId, data) =>
  await userRepository.updateUser(userId, data);

export const deactivateCurrentUser = async userId => {
  const isUserActive = await userRepository.isUserActive(userId);

  if (!isUserActive) return;

  await userRepository.deactivateUser(userId);
};

export const saveUserPhoto = async (userId, fileName) =>
  await userRepository.saveUserPhoto(userId, fileName);
