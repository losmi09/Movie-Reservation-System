import reservationSchema from '../../schemas/reservationSchema.js';
import validateSchema from '../utils/validateSchema.js';
import pushValidationError from '../utils/pushValidationError.js';
import checkIfForeignKeysAreValid from '../utils/checkIfForeignKeysAreValid.js';
import * as crudRepository from '../../repositories/crudRepository.js';
import * as showtimeService from '../../services/showtimeService.js';
import * as reservationService from '../../services/reservationService.js';

const validateReservation = async (body, isUpdating, reservationId) => {
  const errorObj = validateSchema(reservationSchema, body, isUpdating);

  let { showtimeId, seatId } = body;

  // Updating = reservation cancellation
  if (isUpdating) {
    // When udating, we get showtimeId by destructuring it from current reservation
    ({ showtimeId, seatId } = await crudRepository.getOne(
      'reservation',
      reservationId,
    ));
  }

  // Verify that showtime exists
  const showtime = await crudRepository.getOne('showtime', showtimeId);

  if (!showtime)
    pushValidationError(
      errorObj,
      'showtimeId',
      'No showtime found with this ID',
    );

  // Verify that showtime has not started/finished
  const closedReservations = new Date(showtime?.startTime) < new Date();

  if (closedReservations) {
    const field = isUpdating ? 'status' : 'showtimeId';

    const errorMessage = isUpdating
      ? 'You cannot cancel a reservation for a showtime that is ongoing or has ended'
      : 'Reservations are closed for this showtime';

    pushValidationError(errorObj, field, errorMessage);
  }

  // Verify that seatId is provided and that it is a valid UUID
  if (seatId && checkIfForeignKeysAreValid(errorObj.details)) {
    // Verify that seat exists
    const seat = await crudRepository.getOne('seat', seatId);

    if (!seat)
      pushValidationError(errorObj, 'seatId', 'No seat found with this ID');

    if (seat) {
      const [row, reservedSeat, allSeatsReserved] = await Promise.all([
        crudRepository.getOne('row', seat.rowId),
        reservationService.getReservation(showtimeId, seatId),
        showtimeService.areAllSeatsReserved(showtimeId, showtime?.hallId),
      ]);

      // Verify that seat belongs to hall with provided ID
      if (showtime && row.hallId !== showtime.hallId)
        pushValidationError(
          errorObj,
          'seatId',
          'Seat with this ID does not belong to this hall',
        );

      // Verify that seat is not reserved
      if (reservedSeat && !allSeatsReserved)
        pushValidationError(errorObj, 'seatId', 'This seat is reserved');
    }
  }

  return errorObj.details.length ? errorObj : undefined;
};

export default validateReservation;
