import Joi from 'joi';

const rowSchema = Joi.object({
  label: Joi.string()
    .required()
    .trim()
    .valid('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'),
  seatCapacity: Joi.number().required().positive().integer().max(20),
  hallId: Joi.string().guid(),
});

export default rowSchema;
