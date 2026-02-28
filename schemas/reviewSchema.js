import Joi from 'joi';

const reviewSchema = Joi.object({
  movieId: Joi.string().required().guid(),
  userId: Joi.string().required().guid(),
  comment: Joi.string().required().trim(),
  rating: Joi.number().positive().integer().required().min(1).max(5),
});

export default reviewSchema;
