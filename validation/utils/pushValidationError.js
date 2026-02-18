const pushValidationError = (errorObj, path, message) =>
  errorObj.details.push({ path, message });

export default pushValidationError;
