import Joi from 'joi';

const seatSchema = Joi.object({
  rowId: Joi.string().guid(),
  number: Joi.number().required().integer().positive().max(20),
});

export default seatSchema;
