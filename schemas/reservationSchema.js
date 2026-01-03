import Joi from 'joi';

const reservationSchema = Joi.object({
  showtimeId: Joi.number().integer().positive().required(),
  seatId: Joi.number().integer().positive().required(),
  userId: Joi.number().integer().positive().required(),
});

export default reservationSchema;
