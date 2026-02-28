import movieSchema from '../schemas/movieSchema.js';
import cinemaSchema from '../schemas/cinemaSchema.js';
import validateHall from './modelValidation/hallValidation.js';
import validateRow from './modelValidation/rowValidation.js';
import validateSeat from './modelValidation/seatValidation.js';
import validateShowtime from './modelValidation/showtimeValidation.js';
import validateReservation from './modelValidation/reservationValidation.js';
import validateReview from './modelValidation/reviewValidation.js';

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
  seat: (body, isUpdating, seatId) => validateSeat(body, isUpdating, seatId),
  showtime: (body, isUpdating) => validateShowtime(body, isUpdating),
  reservation: (body, isUpdating, reservationId, userId) =>
    validateReservation(body, isUpdating, reservationId, userId),
  review: (body, isUpdating) => validateReview(body, isUpdating),
};

const validateBody = async ({
  model,
  body,
  isUpdating = false,
  id,
  userId,
}) => {
  const error = await validation[model](body, isUpdating, id, userId);

  if (!error) return;

  if (!isUpdating) return error;

  const details = excludeRequiredErrors(error);

  if (details.length) return { details, name: 'ValidationError' };
};

export default validateBody;
