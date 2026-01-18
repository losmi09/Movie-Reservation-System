import seatSchema from '../../schemas/seatSchema.js';
import validateSchema from '../../utils/validation/validateSchema.js';
import checkIfParentExists from '../../utils/validation/checkIfParentExists.js';
import pushValidationError from '../../utils/validation/pushValidationError.js';
import * as rowService from '../../services/rowService.js';

const validateSeat = async (data, isUpdating) => {
  const errorObj = validateSchema(seatSchema, data, isUpdating);

  if (!isUpdating) {
    const { rowId } = data;

    // Verify that parent hall exists
    const row = await checkIfParentExists('row', rowId, errorObj);

    // Verify that parent row is not full of seats
    if (row && (await rowService.isRowFullOfSeats(rowId)))
      pushValidationError(errorObj, 'rowId', 'This row is full of seats');
  }

  return errorObj.details.length ? errorObj : undefined;
};

export default validateSeat;
