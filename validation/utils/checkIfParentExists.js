import pushValidationError from './pushValidationError.js';
import * as crudRepository from '../../repositories/crudRepository.js';

const checkIfParentExists = async (model, id, errorObj) => {
  const parent = await crudRepository.getOne(model, id);

  if (!parent)
    pushValidationError(
      errorObj,
      `${model}Id`,
      `No ${model} found with this ID`
    );

  return parent;
};

export default checkIfParentExists;
