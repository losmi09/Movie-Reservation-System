import movieSchema from '../schemas/movieSchema.js';
import cinemaSchema from '../schemas/cinemaSchema.js';
import hallSchema from '../schemas/hallSchema.js';
import seatSchema from '../schemas/seatSchema.js';
import * as hallService from '../services/hallService.js';

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
  hall: body => {
    const { error } = hallSchema.validate(body, { abortEarly: false });
    return error;
  },
  seat: async body => {
    let errorObj = { details: [], name: 'ValidationError' };

    const { error } = seatSchema.validate(body, { abortEarly: false });

    if (error) errorObj = error;

    try {
      if (await hallService.isSeatRowFull(body.hallId, body.row)) {
        errorObj.details.push({
          message: 'This row is full of seats',
          path: 'row',
        });
      }
    } catch {
      return errorObj;
    }

    return errorObj.details.length ? errorObj : undefined;
  },
};

const validateBody = async (model, body, updating = false) => {
  const error = await validation[model](body);

  if (!error) return;

  if (!updating) return error;

  const details = excludeRequiredErrors(error);

  if (details.length) return { details, name: 'ValidationError' };
};

export default validateBody;
