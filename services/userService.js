import * as userRepository from '../repositories/userRepository.js';

export const getCurrentUser = userId =>
  userRepository.findUserById(userId, { createdAt: true });

export const updateCurrentUser = (userId, data) =>
  userRepository.updateUser(userId, data);

export const deactivateCurrentUser = async userId => {
  const isUserActive = await userRepository.isUserActive(userId);

  if (!isUserActive) return;

  await userRepository.deactivateUser(userId);
};

export const saveUserPhoto = (userId, fileName) =>
  userRepository.saveUserPhoto(userId, fileName);
