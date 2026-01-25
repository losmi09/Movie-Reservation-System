import Joi from 'joi';

const showtimeSchema = Joi.object({
  movieId: Joi.string().required().guid(),
  cinemaId: Joi.string().required().guid(),
  hallId: Joi.string().required().guid(),
  startTime: Joi.date().required().greater('now'),
  endTime: Joi.date().required().min(Joi.ref('startTime')),
  language: Joi.string().trim(),
  price: Joi.number().positive().required(),
});

export default showtimeSchema;
