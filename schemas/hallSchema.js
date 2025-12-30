import Joi from 'joi';

const hallSchema = Joi.object({
  cinemaId: Joi.number().required().integer().positive(),
  name: Joi.string().required().trim(),
  seatsPerRow: Joi.number().required().integer().positive().max(20),
});

export default hallSchema;
