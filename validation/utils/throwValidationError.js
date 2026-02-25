const throwValidationError = (field, message) => ({
  details: [{ path: field, message }],
  name: 'ValidationError',
});

export default throwValidationError;
