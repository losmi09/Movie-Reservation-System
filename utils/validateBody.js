import movieSchema from '../schemas/movieSchema.js';
import cinemaSchema from '../schemas/cinemaSchema.js';
import hallSchema from '../schemas/hallSchema.js';
import rowSchema from '../schemas/rowSchema.js';
import seatSchema from '../schemas/seatSchema.js';
import showtimeSchema from '../schemas/showtimeSchema.js';
import reservationSchema from '../schemas/reservationSchema.js';
import * as hallService from '../services/hallService.js';
import * as rowService from '../services/rowService.js';
import * as showtimeService from '../services/showtimeService.js';
import * as reservationService from '../services/reservationService.js';
import * as crudRepository from '../repositories/crudRepository.js';
import prisma from '../server.js';

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
  row: async (body, updating) => {
    let errorObj = getValidationErrorObject();

    const { error } = rowSchema.validate(body, { abortEarly: false });

    if (error) errorObj = error;

    if (!updating) {
      // Verify that hall exists
      const hall = await crudRepository.getOne('hall', body.hallId);

      if (!hall)
        pushErrorObject(errorObj, 'hallId', 'No hall found with this ID');

      // Verify that hall is not full of rows
      if (hall && (await hallService.isHallFullOfRows(hall.id)))
        pushErrorObject(errorObj, 'hallId', 'This hall is full of rows');
    }

    return errorObj.details.length ? errorObj : undefined;
  },
  seat: async (body, updating, seatId) => {
    let errorObj = getValidationErrorObject();

    const { error } = seatSchema.validate(body, { abortEarly: false });

    if (error) errorObj = error;

    // Prevent changing hallId
    if (updating && body.hallId) {
      body.rowId = undefined;
      pushErrorObject(errorObj, 'rowId', 'rowId cannot be changed');
    }

    let { rowId } = body;

    // When updating, we get rowId by destructuring it from the current seat
    if (updating) ({ rowId } = await crudRepository.getOne('seat', seatId));

    // Verify that hall exists
    const row = await crudRepository.getOne('row', rowId);

    if (!row) pushErrorObject(errorObj, 'rowId', 'No row found with this ID');

    // Verify that seat row is not full
    if (row && (await rowService.isRowFullOfSeats(rowId)))
      pushErrorObject(errorObj, 'rowId', 'This row is full of seats');

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

    // Updating = reservation cancellation
    if (updating) {
      // When updating, we get showtimeId by destructuring it from current reservation
      ({ showtimeId, seatId } = await crudRepository.getOne(
        'reservation',
        reservationId
      ));

      // When updating, we get reservation by its ID
      const reservation = await reservationService.getReservationById(
        reservationId
      );

      if (reservation) {
        // Check if there are reservations with status of waitlist
        const firstInWaitlist = await reservationService.getFirstInWaitlist();

        if (firstInWaitlist)
          await prisma.$transaction([
            reservationService.cancelReservation(reservation.id),
            reservationService.reserveSeatForFirstInWaitlist(
              firstInWaitlist.id,
              seatId
            ),
          ]);
        else await reservationService.cancelReservation(reservation.id);
      }

      // Prevent changing reference IDs
      Object.keys(body).forEach(field => {
        if (field !== 'status')
          pushErrorObject(errorObj, field, `${field} cannot be changed`);
      });
    }

    // Verify that showtime exists
    const showtime = await crudRepository.getOne('showtime', showtimeId);

    if (!showtime)
      pushErrorObject(errorObj, 'showtimeId', 'No showtime found with this ID');

    // Verify that showtime has not started/finished
    const closedReservations = new Date(showtime?.startTime) < new Date();

    if (closedReservations) {
      const field = updating ? 'status' : 'showtimeId';

      const errorMessage = updating
        ? 'You cannot cancel a reservation for a showtime that is ongoing or has ended'
        : 'Reservations are closed for this showtime';

      pushErrorObject(errorObj, field, errorMessage);
    }

    if (seatId) {
      // Verify that seat exists
      const seat = await crudRepository.getOne('seat', seatId);

      if (!seat)
        pushErrorObject(errorObj, 'seatId', 'No seat found with this ID');

      if (seat) {
        const row = await crudRepository.getOne('row', seat.rowId);

        // Verify that seat is not reserved
        const reservedSeat = await reservationService.getReservation(
          showtimeId,
          seatId
        );

        // Verify that seat in hall with provided ID exists
        if (row?.hallId !== showtime?.hallId)
          pushErrorObject(
            errorObj,
            'seatId',
            'No seat found with this ID in this hall'
          );

        if (!updating && reservedSeat) {
          // Check if all seats are reserved
          const allSeatsReserved = await showtimeService.areAllSeatsReserved(
            showtime.id,
            showtime.hallId
          );

          // If all seats are reserved, make a reservation with status of waitlist
          if (allSeatsReserved) {
            body.seatId = undefined;
            body.status = 'waitlist';
          } else pushErrorObject(errorObj, 'seatId', 'This seat is reserved');
        }
      }
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
