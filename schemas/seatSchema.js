import Joi from 'joi';

export const seatSchema = Joi.object({
  number: Joi.number().required().integer().positive().max(20),
});
