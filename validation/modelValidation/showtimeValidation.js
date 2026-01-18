import showtimeSchema from '../../schemas/showtimeSchema.js';
import validateSchema from '../../utils/validation/validateSchema.js';
import pushValidationError from '../../utils/validation/pushValidationError.js';
import * as crudRepository from '../../repositories/crudRepository.js';
import * as showtimeService from '../../services/showtimeService.js';

const getReferences = async (movieId, cinemaId, hallId) =>
  await Promise.all([
    crudRepository.getOne('movie', movieId),
    crudRepository.getOne('cinema', cinemaId),
    crudRepository.getOne('hall', hallId),
  ]);

const checkIfEveryReferenceExists = (foundReferences, body, errorObj) => {
  foundReferences.forEach((foundReference, i) => {
    const references = ['movieId', 'cinemaId', 'hallId'];

    const reference = references[i];

    // If reference id is provided in body but it is not found in DB add error to errorObj
    if (body[reference] && !foundReference)
      pushValidationError(
        errorObj,
        reference,
        `No ${reference.slice(0, -2)} found with this ID`,
      );
  });
};

const checkIfInvalidTimeProvided = errorsArray =>
  errorsArray.some(err => {
    const { path } = err;
    return path.includes('startTime') || path.includes('endTime');
  });

const validateShowtime = async (data, isUpdating) => {
  console.log({ data });
  const errorObj = validateSchema(showtimeSchema, data, isUpdating);

  // Default to 0 to avoid undefined
  const { movieId, cinemaId = 0, hallId = 0, startTime, endTime } = data;

  if (!isUpdating) {
    // Verify that every showtime reference exists
    const references = await getReferences(movieId, cinemaId, hallId);

    checkIfEveryReferenceExists(references, data, errorObj);

    const [, , hall] = references;

    // Verify that hall with provided ID belongs to cinema with provided ID
    if (hall && hall.cinemaId !== cinemaId)
      pushValidationError(
        errorObj,
        'hallId',
        'Hall with this ID does not belong to this cinema',
      );
  }

  const invalidTime = checkIfInvalidTimeProvided(errorObj.details);

  // Verify that hall does not have an active showtime in the given time range
  if (!invalidTime) {
    const isShowtimeOngoing = await showtimeService.isShowtimeOngoing(
      cinemaId,
      hallId,
      new Date(startTime),
      new Date(endTime),
    );

    if (isShowtimeOngoing)
      pushValidationError(
        errorObj,
        'startTime',
        'Hall already has an active showtime in the given time range',
      );
  }

  return errorObj.details.length ? errorObj : undefined;
};

export default validateShowtime;
