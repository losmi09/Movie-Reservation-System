const excludeRequiredErrors = error =>
  error.details.filter(err => !err.message.endsWith('required'));

export default excludeRequiredErrors;
