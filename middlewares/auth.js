import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import * as authService from '../services/authService.js';

export const protect = catchAsync(async (req, res, next) => {
  let accessToken;

  if (req.headers?.authorization?.startsWith('Bearer'))
    accessToken = req.headers.authorization.split(' ')[1];

  if (!accessToken)
    return next(
      new AppError("You're logged out. Please log in to get access", 401)
    );

  const user = await authService.protect(accessToken);

  req.user = user;

  next();
});

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError("You don't have permission to perform this action", 403)
      );

    next();
  };
};
