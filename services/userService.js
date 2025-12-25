import * as userRepository from '../repositories/userRepository.js';

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(field => {
    if (allowedFields.includes(field)) newObj[field] = obj[field];
  });
  return newObj;
};

export const updateUser = async (userId, data) => {
  const filteredData = filterObj(data, 'firstName', 'lastName', 'email');

  const updatedUser = await userRepository.updateUser(userId, filteredData);

  return updatedUser;
};
