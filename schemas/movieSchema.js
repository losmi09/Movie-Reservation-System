import Joi from 'joi';

export const movieSchema = Joi.object({
  title: Joi.string().required().trim(),
  description: Joi.string().required().trim(),
  posterImage: Joi.string().trim(),
});
