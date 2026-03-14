// Prevent changing reference IDs
const getReferenceErrors = data =>
  Object.keys(data)
    .filter(field => field.endsWith('Id'))
    .map(field => ({ path: field, message: `${field} cannot be changed` }));

export const validateSchema = (schema, isUpdating) => (req, res, next) => {
  const { body: data } = req;

  const { error } = schema.validate({ ...data }, { abortEarly: false });

  let errors = error ? error.details : [];

  if (isUpdating) {
    // When updating, required-field validation errors are ignored
    errors = error.details.filter(err => !err.message.endsWith('required'));
    errors = [...errors, ...getReferenceErrors(data)];
  }

  if (errors.length === 0) return next();

  return next({ details: errors, name: 'ValidationError' });
};
