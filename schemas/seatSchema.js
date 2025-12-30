import Joi from 'joi';

const seatSchema = Joi.object({
  hallId: Joi.number().required().integer().positive(),
  row: Joi.string()
    .required()
    .trim()
    .valid('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'),
  number: Joi.number().required().integer().positive().max(20),
});

export default seatSchema;
