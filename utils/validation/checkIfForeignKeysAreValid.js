const checkIfForeignKeysAreValid = errorsArray =>
  !errorsArray.some(err => err.path[0].endsWith('Id'));

export default checkIfForeignKeysAreValid;
