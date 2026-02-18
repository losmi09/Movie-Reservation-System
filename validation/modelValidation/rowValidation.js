import rowSchema from '../../schemas/rowSchema.js';
import pushValidationError from '../utils/pushValidationError.js';
import validateSchema from '../utils/validateSchema.js';
import checkIfParentExists from '../utils/checkIfParentExists.js';
import * as hallService from '../../services/hallService.js';

const validateRow = async (data, isUpdating) => {
  const errorObj = validateSchema(rowSchema, data, isUpdating);

  if (!isUpdating) {
    // Verify that parent hall exists
    const { hallId } = data;

    const hall = await checkIfParentExists('hall', hallId, errorObj);

    // Verify that hall is not full of rows
    if (hall && (await hallService.isHallFullOfRows(hallId)))
      pushValidationError(errorObj, 'hallId', 'This hall is full of rows');
  }

  return errorObj.details.length ? errorObj : undefined;
};

export default validateRow;
