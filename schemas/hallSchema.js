import Joi from 'joi';

const hallSchema = Joi.object({
  cinemaId: Joi.number().required().integer().positive(),
  name: Joi.string().required().trim(),
  maxRows: Joi.number().required().positive().integer().min(5).max(20),
});

export default hallSchema;
