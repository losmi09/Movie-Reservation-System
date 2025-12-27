import catchAsync from '../utils/catchAsync.js';
import { updateUserSchema } from '../schemas/userSchema.js';
import { deactivateUserSchema } from '../schemas/userSchema.js';
import AppError from '../utils/appError.js';
import * as userService from '../services/userService.js';

export const saveUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new AppError('No image provided', 422));

  const user = await userService.saveUserPhoto(req.user.id, req.file.fileName);

  res.status(200).json({ data: user });
});

export const getCurrentUser = catchAsync(async (req, res, next) => {
  const currentUser = await userService.getCurrentUser(req.user.id);

  res.status(200).json({ data: currentUser });
});

export const updateCurrentUser = catchAsync(async (req, res, next) => {
  const { error } = updateUserSchema.validate(req.body, { abortEarly: false });

  if (error) return next(error);

  const updatedUser = await userService.updateCurrentUser(
    req.user.id,
    req.body
  );

  res.status(200).json({
    data: { ...updatedUser, updatedAt: new Date() },
  });
});

export const deactivateCurrentUser = catchAsync(async (req, res, next) => {
  const { password } = req.body;

  const { error } = deactivateUserSchema.validate(
    { password },
    { abortEarly: false }
  );

  if (error) return next(error);

  await userService.deactivateCurrentUser(req.user.id, password);

  res.status(204).end();
});
