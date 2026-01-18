import hallSchema from '../../schemas/hallSchema.js';
import checkIfParentExists from '../../utils/validation/checkIfParentExists.js';
import validateSchema from '../../utils/validation/validateSchema.js';

const validateHall = async (data, isUpdating) => {
  const errorObj = validateSchema(hallSchema, data, isUpdating);

  // Verify that parent cinema exists
  if (!isUpdating) await checkIfParentExists('cinema', data.cinemaId, errorObj);

  // If there are no validation errors, simply return undefined
  return errorObj.details.length ? errorObj : undefined;
};

export default validateHall;
