import movieSchema from '../schemas/movieSchema.js';
import cinemaSchema from '../schemas/cinemaSchema.js';
import hallSchema from '../schemas/hallSchema.js';
import seatSchema from '../schemas/seatSchema.js';
import showtimeSchema from '../schemas/showtimeSchema.js';
import * as hallService from '../services/hallService.js';
import * as showtimeService from '../services/showtimeService.js';
import * as crudRepository from '../repositories/crudRepository.js';

const excludeRequiredErrors = error =>
  error.details.filter(err => !err.message.endsWith('required'));

const getValidationErrorObject = () => {
  return { details: [], name: 'ValidationError' };
};

const pushErrorObject = (errorObj, path, message) =>
  errorObj.details.push({ path, message });

const validation = {
  movie: body => {
    const { error } = movieSchema.validate(body, { abortEarly: false });
    return error;
  },
  cinema: body => {
    const { error } = cinemaSchema.validate(body, { abortEarly: false });
    return error;
  },
  hall: async (body, updating) => {
    let errorObj = getValidationErrorObject();

    const { error } = hallSchema.validate(body, { abortEarly: false });

    if (error) errorObj = error;

    if (updating && body.cinemaId) {
      pushErrorObject(errorObj, 'cinemaId', 'cinemaId cannot be changed');
      return errorObj;
    }

    if (!updating) {
      const cinema = await crudRepository.getOne('cinema', body.cinemaId);

      if (!cinema)
        pushErrorObject(errorObj, 'cinemaId', 'No cinema found with this ID');
    }

    return errorObj.details.length ? errorObj : undefined;
  },
  seat: async (body, updating, seatId) => {
    let errorObj = getValidationErrorObject();

    const { error } = seatSchema.validate(body, { abortEarly: false });

    if (error) errorObj = error;

    if (updating && body.hallId) {
      body.hallId = undefined;
      pushErrorObject(errorObj, 'hallId', 'hallId cannot be changed');
    }

    let { hallId } = body;

    if (updating) ({ hallId } = await crudRepository.getOne('seat', seatId));

    const hall = await crudRepository.getOne('hall', hallId);

    if (!hall)
      pushErrorObject(errorObj, 'hallId', 'No hall found with this ID');

    const { row } = body;

    if (hall && row && (await hallService.isSeatRowFull(hall.id, row)))
      pushErrorObject(errorObj, 'row', 'This row is full of seats');

    return errorObj.details.length ? errorObj : undefined;
  },
  showtime: async (body, updating) => {
    let errorObj = getValidationErrorObject();

    const { error } = showtimeSchema.validate(body, { abortEarly: false });

    if (error) errorObj = error;

    const { movieId, cinemaId = 0, hallId = 0, startTime, endTime } = body;

    if (!updating) {
      const fields = await Promise.all([
        crudRepository.getOne('movie', movieId),
        crudRepository.getOne('cinema', cinemaId),
        crudRepository.getOne('hall', hallId),
      ]);

      fields.forEach((foundField, i) => {
        const fields = { 0: 'movieId', 1: 'cinemaId', 2: 'hallId' };

        const field = fields[i];

        if (body[field] && !foundField)
          pushErrorObject(errorObj, field, `No ${field} found with this ID`);
      });

      const [, , hall] = fields;

      if (hall && hall.cinemaId !== cinemaId)
        pushErrorObject(
          errorObj,
          'hallId',
          'Hall with this ID in this cinema does not exist'
        );
    }

    const invalidTime = error?.details.some(
      err => err.path.includes('startTime') || err.path.includes('endTime')
    );

    if (!invalidTime) {
      const isShowtimeOngoing = await showtimeService.isShowtimeOngoing(
        cinemaId,
        hallId,
        new Date(startTime),
        new Date(endTime)
      );

      if (isShowtimeOngoing)
        pushErrorObject(
          errorObj,
          'startTime',
          'Hall already has an active showtime in the given time range'
        );
    }

    return errorObj.details.length ? errorObj : undefined;
  },
};

const validateBody = async (model, body, updating = false, id) => {
  const error = await validation[model](body, updating, id);

  if (!error) return;

  if (!updating) return error;

  const details = excludeRequiredErrors(error);

  if (details.length) return { details, name: 'ValidationError' };
};

export default validateBody;
