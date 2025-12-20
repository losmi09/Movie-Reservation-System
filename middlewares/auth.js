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
