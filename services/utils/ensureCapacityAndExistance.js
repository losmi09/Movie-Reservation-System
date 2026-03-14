import { getCapacityStatus } from '../../repositories/utils/getCapacityStatus.js';
import { BusinessLogicError } from '../../utils/BusinessLogicError.js';

export const ensureCapacityAndExistance = async (model, id) => {
  const status = await getCapacityStatus(model, id);

  if (!status)
    throw new BusinessLogicError(
      `${model}Id`,
      `No ${model} found with this Id`,
    );

  const { capacity, count } = status;

  if (capacity <= count) {
    const errorMessages = {
      hall: 'This hall is full of rows',
      row: 'This row is full of seats',
    };

    throw new BusinessLogicError(`${model}Id`, errorMessages[model]);
  }
};
