import preventChangingReferenceIds from './preventChangingReferenceIds.js';

const validateSchema = (schema, data, isUpdating) => {
  const errorObj = { details: [], name: 'ValidationError' };

  const { error } = schema.validate(data, { abortEarly: false });

  // Merge Joi validation errors into our error object
  if (error) errorObj.details.push(...error.details);

  // Prevent changing reference IDs
  if (isUpdating) preventChangingReferenceIds(data, errorObj);

  return errorObj;
};

export default validateSchema;
