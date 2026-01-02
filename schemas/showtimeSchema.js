import Joi from 'joi';

const showtimeSchema = Joi.object({
  movieId: Joi.number().required().integer().positive(),
  cinemaId: Joi.number().required().integer().positive(),
  hallId: Joi.number().required().integer().positive(),
  startTime: Joi.date().required().greater('now'),
  endTime: Joi.date().required().min(Joi.ref('startTime')),
  price: Joi.number().positive().required(),
});

export default showtimeSchema;
