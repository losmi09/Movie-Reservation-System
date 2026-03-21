import Joi from 'joi';

export const hallSchema = Joi.object({
  name: Joi.string().required().trim(),
  maxRows: Joi.number().required().positive().integer().min(5).max(20),
});
