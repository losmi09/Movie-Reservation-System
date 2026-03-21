import Joi from 'joi';

export const reviewSchema = Joi.object({
  comment: Joi.string().trim().required(),
  rating: Joi.number().positive().integer().required().min(1).max(5),
});
