import movieSchema from '../schemas/movieSchema.js';
import cinemaSchema from '../schemas/cinemaSchema.js';
import hallSchema from '../schemas/hallSchema.js';
import seatSchema from '../schemas/seatSchema.js';
import showtimeSchema from '../schemas/showtimeSchema.js';
import reservationSchema from '../schemas/reservationSchema.js';
import * as hallService from '../services/hallService.js';
import * as showtimeService from '../services/showtimeService.js';
import * as crudRepository from '../repositories/crudRepository.js';

// When updating, required-field validation errors are ignored
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

    // Prevent changing cinemaId to
    if (updating && body.cinemaId) {
      pushErrorObject(errorObj, 'cinemaId', 'cinemaId cannot be changed');
      return errorObj;
    }

    // Verify that cinema exists
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

    // Prevent changing hallId
    if (updating && body.hallId) {
      body.hallId = undefined;
      pushErrorObject(errorObj, 'hallId', 'hallId cannot be changed');
    }

    let { hallId, row } = body;

    // When updating, we get hallId by destructuring it from current seat
    if (updating) ({ hallId } = await crudRepository.getOne('seat', seatId));

    // Verify that hall exists
    const hall = await crudRepository.getOne('hall', hallId);

    if (!hall)
      pushErrorObject(errorObj, 'hallId', 'No hall found with this ID');

    const invalidRow = errorObj.details.some(err => err.path[0] === 'row');

    // Verify that seat row is not full
    if (hall && !invalidRow && (await hallService.isSeatRowFull(hall.id, row)))
      pushErrorObject(errorObj, 'row', 'This row is full of seats');

    return errorObj.details.length ? errorObj : undefined;
  },
  showtime: async (body, updating) => {
    let errorObj = getValidationErrorObject();

    const { error } = showtimeSchema.validate(body, { abortEarly: false });

    if (error) errorObj = error;

    // Prevent changing reference IDs
    if (updating) {
      Object.keys(body).forEach(field => {
        if (field.endsWith('Id'))
          pushErrorObject(errorObj, field, `${field} cannot be changed`);
      });
    }

    // Default to 0 to avoid undefined
    const { movieId, cinemaId = 0, hallId = 0, startTime, endTime } = body;

    if (!updating) {
      // Verify that every showtime reference exists
      const fields = await Promise.all([
        crudRepository.getOne('movie', movieId),
        crudRepository.getOne('cinema', cinemaId),
        crudRepository.getOne('hall', hallId),
      ]);

      fields.forEach((foundField, i) => {
        const fields = { 0: 'movieId', 1: 'cinemaId', 2: 'hallId' };

        const field = fields[i];

        // If reference id is provided in body but it is not found in DB add error to errorObj
        if (body[field] && !foundField)
          pushErrorObject(errorObj, field, `No ${field} found with this ID`);
      });

      const [, , hall] = fields;

      // Verify that hall with provided ID exists in cinema with provided ID
      if (hall?.cinemaId !== cinemaId)
        pushErrorObject(
          errorObj,
          'hallId',
          'Hall with this ID in this cinema does not exist'
        );
    }

    const invalidTime = error?.details.some(
      err => err.path.includes('startTime') || err.path.includes('endTime')
    );

    // Verify that hall does not have an active showtime in the given time range
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
  reservation: async (body, updating, reservationId) => {
    let errorObj = getValidationErrorObject();

    const { error } = reservationSchema.validate(body);

    if (error) errorObj = error;

    let { showtimeId, seatId } = body;

    if (updating) {
      // User can only cancel its reservation
      body.status = 'cancelled';

      // Prevent changing reference IDs
      Object.keys(body).forEach(field => {
        if (field !== 'status')
          pushErrorObject(errorObj, field, `${field} cannot be changed`);
      });

      // When updating, we get showtimeId by destructuring it from current reservation
      ({ showtimeId } = await crudRepository.getOne(
        'reservation',
        reservationId
      ));
    }

    // Verify that showtime exists
    const showtime = await crudRepository.getOne('showtime', showtimeId);

    if (!showtime)
      pushErrorObject(errorObj, 'showtimeId', 'No showtime found with this ID');

    // Verify that showtime has not started/finished
    if (new Date(showtime?.startTime) < new Date()) {
      const field = updating ? 'status' : 'showtimeId';

      const errorMessage = updating
        ? 'You cannot cancel a reservation for a showtime that is ongoing or has ended'
        : 'Reservations are closed for this showtime';

      pushErrorObject(errorObj, field, errorMessage);
    }

    if (seatId) {
      // Verify that seat exists
      const seat = await crudRepository.getOne('seat', seatId);

      let hall;

      if (seat) hall = await crudRepository.getOne('hall', seat.hallId);

      // Verify that seat in hall with provided ID exists
      if (!seat || hall?.cinemaId !== showtime?.cinemaId)
        pushErrorObject(errorObj, 'seatId', 'No seat found with this ID');
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
