import AppError from '../utils/appError.js';

const handleNotFoundRecord = err => {
  const { modelName, constraint } = err.meta;

  const field = err.message.includes('Foreign key')
    ? constraint.split('_')[1]
    : modelName.toLowerCase();

  return new AppError(`No ${field} found with this ID`, 404);
};

const handleUniqueField = (err, res, instance) => {
  const { modelName, target } = err.meta;

  const fields = {
    Hall: 'name',
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

  const error = [{ path: field, message: messages[modelName] ?? message }];

  return throwValidationError(res, error, instance);
};

const handleInvalidQuery = () => new AppError('Invalid query', 400);

const handleTooLargePayload = () =>
  new AppError('Request payload is too large', 413);

const handleMulterError = err => new AppError(err.message, 422);

export const throwValidationError = (res, error, instance) => {
  const errorObj = { errors: {} };

  error.forEach(
    err => (errorObj.errors[err.path] = [err.message.replaceAll('"', '')]),
  );

  res.status(422).json({
    title: 'Validation Failed',
    status: 422,
    detail: 'One or more fields failed validation',
    timestamp: new Date(),
    instance,
    ...errorObj,
  });
};

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

const globalErrorHandler = (err, req, res, next) => {
  let error = Object.create(err);
  error.title = error.title || 'Internal Server Error';
  error.status = error.status || 500;

  if (err.name === 'ValidationError')
    return throwValidationError(res, err.details, req.originalUrl);

  if (error.code === 'P2002')
    return handleUniqueField(error, res, req.originalUrl);

  if (err.name === 'MulterError') error = handleMulterError(err);

  if (error.code === 'P2025' || error.code === 'P2003')
    error = handleNotFoundRecord(err);

  if (err.name === 'PayloadTooLargeError') error = handleTooLargePayload();

  if (
    err.message.includes('Error in query') ||
    err.message === 'unexpected empty path'
  )
    error = handleInvalidQuery();

  sendError(error, res, req.originalUrl);
};

export default globalErrorHandler;
