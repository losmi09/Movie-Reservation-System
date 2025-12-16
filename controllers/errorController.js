const handleUniqueField = (err, res, instance) => {
  const { modelName, target } = err.meta;

  const error = [
    {
      path: target[0],
      message: `${modelName} with this name already exists`,
    },
  ];

  return throwValidationError(error, res, instance);
};

export const throwValidationError = (error, res, instance) => {
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
  const { message, status, title, timestamp, stack } = err;

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
  error.status = error.status || 500;

  if (error.code === 'P2002')
    return handleUniqueField(error, res, req.originalUrl);

  sendError(error, res, req.originalUrl);
};

export default globalErrorHandler;
