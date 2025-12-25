import catchAsync from '../utils/catchAsync.js';
import sanitizeOutput from '../utils/sanitizeOutput.js';
import { updateUserSchema } from '../schemas/userSchema.js';
import * as userService from '../services/userService.js';

export const updateUser = catchAsync(async (req, res, next) => {
  const { error } = updateUserSchema.validate(req.body, { abortEarly: false });

  if (error) return next(error);

  const updatedUser = await userService.updateUser(req.user.id, req.body);

  sanitizeOutput(updatedUser);

  res.status(200).json({
    data: { ...updatedUser, updatedAt: new Date() },
  });
});
