import Joi from 'joi';

export const showtimeSchema = Joi.object({
  cinemaId: Joi.string().trim().required().guid(),
  hallId: Joi.string().trim().required().guid(),
  startTime: Joi.date().required().greater('now'),
  endTime: Joi.date().required().min(Joi.ref('startTime')),
  language: Joi.string().trim(),
  price: Joi.number().positive().required(),
});
