import AppError from '../utils/appError.js';

const handleUniqueField = (err, res, instance) => {
  const { modelName, target } = err.meta;

  const error = [
    {
      path: target[0],
      message: `${modelName} with this ${target} already exists`,
    },
  ];

  return throwValidationError(res, error, instance);
};

const handleInvalidQueryParam = () => new AppError('Invalid query param', 400);

const handleTooLargePayload = () =>
  new AppError('Request payload is too large', 413);

export const throwValidationError = (res, error, instance) => {
  const errorObj = { errors: {} };

  error.forEach(
    err => (errorObj.errors[err.path] = [err.message.replaceAll('"', '')])
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
  if (err.name === 'PayloadTooLargeError') error = handleTooLargePayload();
  if (
    err.message.includes('Error in query') ||
    err.message === 'unexpected empty path'
  )
    error = handleInvalidQueryParam();

  sendError(error, res, req.originalUrl);
};

export default globalErrorHandler;
