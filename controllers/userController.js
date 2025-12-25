import catchAsync from '../utils/catchAsync.js';
import sanitizeOutput from '../utils/sanitizeOutput.js';
import { updateUserSchema } from '../schemas/userSchema.js';
import { deactivateUserSchema } from '../schemas/userSchema.js';
import * as userService from '../services/userService.js';

export const updateCurrentUser = catchAsync(async (req, res, next) => {
  const { error } = updateUserSchema.validate(req.body, { abortEarly: false });

  if (error) return next(error);

  const updatedUser = await userService.updateCurrentUser(
    req.user.id,
    req.body
  );

  sanitizeOutput(updatedUser);

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
