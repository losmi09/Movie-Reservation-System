import Joi from 'joi';

const movieSchema = Joi.object({
  title: Joi.string().required().trim(),
  description: Joi.string().required().trim(),
  posterImage: Joi.string().trim(),
});

export default movieSchema;
