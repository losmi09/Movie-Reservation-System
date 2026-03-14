import { checkIfRecordExists } from '../../repositories/utils/checkIfRecordExists.js';
import { BusinessLogicError } from '../../utils/BusinessLogicError.js';

export const ensureParentExists = async (model, parentId) => {
  if (!(await checkIfRecordExists(model, parentId)))
    throw new BusinessLogicError(
      `${model}Id`,
      `No ${model} found with this ID`,
    );
};
