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

  const config = {
    ValidationError: {
      title: 'Validation Failed',
      detail: 'One or more fields failed validation',
    },
    BusinessLogicError: {
      title: 'Business Logic Violation',
      detail:
        'The request could not be processed due to business rule constraints',
    },
  };

  const STATUS_CODE = 422;

  const { title, detail } = config[error.name];

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

  const customConfig = {
    Hall: {
      field: 'name',
      message: 'Hall with this name in this cinema already exists',
    },
    Row: {
      field: 'label',
      message: 'Row with this label in this hall already exists',
    },
    Seat: {
      field: 'number',
      message: 'Seat with this number in this row already exists',
    },
    Reservation: {
      field: 'seatId',
      message: 'This seat is reserved',
    },
    Review: {
      field: 'movieId',
      message: 'You have already reviewed this movie',
    },
  };

  const modelConfig = customConfig[modelName] ?? {};

  const field = modelConfig.field ?? target;

  const message =
    modelConfig.message ?? `${modelName} with this ${field} already exists`;

  // Error object structure that fits handleSemanticError function
  const error = {
    details: [{ path: field, message }],
    name: 'BusinessLogicError',
  };

  return handleSemanticError(res, error, instance);
};

const handleInvalidQuery = () => new AppError('Invalid query', 400);

const handleTooLargePayload = () =>
  new AppError('Request payload is too large', 413);

const handleMulterError = err => new AppError(err.message, 422);

const DEFAULT_ERROR_STATUS_CODE = 500;

const sendError = (err, res, instance) => {
  const { isOperational, status, title, timestamp } = err;

  // Extract non-enumerable properties and rest of the error object
  const { name, message, stack, ...rest } = err;

  const statusCode = status ?? DEFAULT_ERROR_STATUS_CODE;

  // Handle errors in development environment
  if (process.env.NODE_ENV === 'development')
    return res.status(statusCode).json({
      name,
      message,
      err: rest,
      stack,
    });

  // Handle non-operational errors in production
  if (!isOperational)
    return res.status(DEFAULT_ERROR_STATUS_CODE).json({
      title: 'Internal Server Error',
      status: DEFAULT_ERROR_STATUS_CODE,
      detail: 'Something Went Wrong!',
      instance,
      timestamp: new Date(),
    });

  // Handle operational errors in production
  res.status(status).json({
    title,
    status,
    detail: message,
    instance,
    timestamp,
  });
};

export const globalErrorHandler = (err, req, res, next) => {
  const { name, message, code, stack, ...rest } = err;

  // Cannot make shallow copy using {...err} syntax because spread operator does not see non-enumerable properties of an error object (name, message and stack)

  let error = { name, message, code, stack, ...rest };

  error.title ??= 'Internal Server Error';
  error.status ??= DEFAULT_ERROR_STATUS_CODE;

  const { originalUrl: instance } = req;

  if (name === 'ValidationError' || name === 'BusinessLogicError')
    return handleSemanticError(res, err, instance);

  if (code === 'P2002') return handleUniqueField(error, res, instance);

  if (name === 'MulterError') error = handleMulterError(err);

  if (code === 'P2025' || code === 'P2003') error = handleNotFoundRecord(err);

  if (name === 'PayloadTooLargeError') error = handleTooLargePayload();

  if (message.includes('Error in query') || message === 'unexpected empty path')
    error = handleInvalidQuery();

  sendError(error, res, instance);
};
