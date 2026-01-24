import Joi from 'joi';

const showtimeSchema = Joi.object({
  movieId: Joi.string().guid(),
  cinemaId: Joi.string().guid(),
  hallId: Joi.string().guid(),
  startTime: Joi.date().required().greater('now'),
  endTime: Joi.date().required().min(Joi.ref('startTime')),
  language: Joi.string().trim(),
  price: Joi.number().positive().required(),
});

export default showtimeSchema;
