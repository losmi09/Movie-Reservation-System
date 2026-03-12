import Joi from 'joi';

const showtimeSchema = Joi.object({
  movieId: Joi.string().trim().required().guid(),
  cinemaId: Joi.string().trim().required().guid(),
  hallId: Joi.string().trim().required().guid(),
  startTime: Joi.date().required().greater('now'),
  endTime: Joi.date().required().min(Joi.ref('startTime')),
  language: Joi.string().trim(),
  price: Joi.number().positive().required(),
});

export default showtimeSchema;
