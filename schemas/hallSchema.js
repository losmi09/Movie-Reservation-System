import Joi from 'joi';

const hallSchema = Joi.object({
  cinemaId: Joi.number().integer().positive(),
  name: Joi.string().required().trim(),
});

export default hallSchema;
