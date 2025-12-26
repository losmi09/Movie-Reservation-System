import movieSchema from '../schemas/movieSchema.js';
import cinemaSchema from '../schemas/cinemaSchema.js';

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
};

const validateBody = (model, body, updating = false) => {
  const error = validation[model](body);

  if (!error) return;

  if (!updating) return error;

  const details = excludeRequiredErrors(error);

  if (details.length) return { details, name: 'ValidationError' };
};

export default validateBody;
