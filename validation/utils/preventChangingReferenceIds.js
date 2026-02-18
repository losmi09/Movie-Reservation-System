import pushValidationError from './pushValidationError.js';

const preventChangingReferenceIds = (body, errorObj) =>
  Object.keys(body).forEach(field => {
    if (field.endsWith('Id'))
      pushValidationError(errorObj, field, `${field} cannot be changed`);
  });

export default preventChangingReferenceIds;
