import Joi from 'joi';

export const hallSchema = Joi.object({
  cinemaId: Joi.string().trim().required().guid(),
  name: Joi.string().required().trim(),
  maxRows: Joi.number().required().positive().integer().min(5).max(20),
});
