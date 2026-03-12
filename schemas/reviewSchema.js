import Joi from 'joi';

const reviewSchema = Joi.object({
  movieId: Joi.string().trim().required().guid(),
  userId: Joi.string().trim().required().guid(),
  comment: Joi.string().trim().required(),
  rating: Joi.number().positive().integer().required().min(1).max(5),
});

export default reviewSchema;
