import { AppError } from '../utils/appError.js';

const handleNotFoundRecord = err => {
  const { modelName, constraint } = err.meta;

  const field = err.message.includes('Foreign key')
    ? constraint.split('_')[1]
    : modelName.toLowerCase();

  return new AppError(`No ${field} found with this ID`, 404);
};

const handleSemanticError = (res, error, instance) => {
  const errorObj = { errors: {} };

  error.details.forEach(
    err => (errorObj.errors[err.path] = [err.message.replaceAll('"', '')]),
  );

  const { name: type } = error;

  const title =
    type === 'ValidationError'
      ? 'Validation Failed'
      : 'Business Logic Violation';

  const detail =
    type === 'ValidationError'
      ? 'One or more fields failed validation'
      : 'The request could not be processed due to business rule constraints';

  const STATUS_CODE = 422;

  res.status(STATUS_CODE).json({
    title,
    status: STATUS_CODE,
    detail,
    timestamp: new Date(),
    instance,
    ...errorObj,
  });
};

const handleUniqueField = (err, res, instance) => {
  const { modelName, target } = err.meta;

  const fields = {
    Hall: 'name',
    Row: 'label',
    Seat: 'number',
    Reservation: 'seatId',
    Review: 'movieId',
  };

  const messages = {
    Hall: 'Hall with this name in this cinema already exists',
    Row: 'Row with this label in this hall already exists',
    Seat: 'Seat with this number in this row already exists',
    Reservation: 'This seat is reserved',
    Review: 'You have already reviewed this movie',
  };

  const field = fields[modelName] ?? target;

  const message = `${modelName} with this ${field} already exists`;

  const error = {
    details: [{ path: field, message: messages[modelName] ?? message }],
  };

  return handleSemanticError(res, error, instance);
};

const handleInvalidQuery = () => new AppError('Invalid query', 400);

const handleTooLargePayload = () =>
  new AppError('Request payload is too large', 413);

const handleMulterError = err => new AppError(err.message, 422);

const sendError = (err, res, instance) => {
  const { isOperational, message, status, title, timestamp, stack } = err;

  if (!isOperational && process.env.NODE_ENV === 'production')
    return res.status(500).json({
      title: 'Internal Server Error',
      status: 500,
      detail: 'Something Went Wrong!',
      instance,
      timestamp: new Date(),
    });

  res.status(status).json({
    title,
    status,
    detail: message,
    timestamp,
    instance,
    error: process.env.NODE_ENV === 'development' ? err : undefined,
    stack: process.env.NODE_ENV === 'development' ? stack : undefined,
  });
};

export const globalErrorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.title = error.title || 'Internal Server Error';
  error.status = error.status || 500;

  const { name, code, message } = err;

  if (name === 'ValidationError' || name === 'BusinessLogicError')
    return handleSemanticError(res, err, req.originalUrl);

  if (code === 'P2002') return handleUniqueField(error, res, req.originalUrl);

  if (name === 'MulterError') error = handleMulterError(err);

  if (code === 'P2025' || code === 'P2003') error = handleNotFoundRecord(err);

  if (name === 'PayloadTooLargeError') error = handleTooLargePayload();

  if (message.includes('Error in query') || message === 'unexpected empty path')
    error = handleInvalidQuery();

  sendError(error, res, req.originalUrl);
};
