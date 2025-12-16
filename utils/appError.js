const errorMessages = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Resource Not Found',
  422: 'Unprocessable Entity',
  500: 'Internal Server Error',
};

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.status = statusCode;
    this.title = errorMessages[statusCode];
    this.timestamp = new Date();
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
