import movieSchema from '../schemas/movieSchema.js';
import cinemaSchema from '../schemas/cinemaSchema.js';
import validateHall from '../validation/hallValidation.js';
import validateRow from '../validation/rowValidation.js';
import validateSeat from '../validation/seatValidation.js';
import validateShowtime from '../validation/showtimeValidation.js';
import validateReservation from '../validation/reservationValidation.js';

// When updating, required-field validation errors are ignored
const excludeRequiredErrors = error =>
  error.details.filter(err => !err.message.endsWith('required'));

const validation = {
  movie: body => {
    const { error } = movieSchema.validate(body, { abortEarly: false });
    return error;
  },
  cinema: body => {
    const { error } = cinemaSchema.validate(body, { abortEarly: false });
    return error;
  },
  hall: (body, isUpdating) => validateHall(body, isUpdating),
  row: (body, isUpdating) => validateRow(body, isUpdating),
  seat: (body, updating, seatId) => validateSeat(body, updating, seatId),
  showtime: (body, updating) => validateShowtime(body, updating),
  reservation: (body, updating, reservationId) =>
    validateReservation(body, updating, reservationId),
};

const validateBody = async (model, body, isUpdating = false, id) => {
  const error = await validation[model](body, isUpdating, id);

  if (!error) return;

  if (!isUpdating) return error;

  const details = excludeRequiredErrors(error);

  if (details.length) return { details, name: 'ValidationError' };
};

export default validateBody;
