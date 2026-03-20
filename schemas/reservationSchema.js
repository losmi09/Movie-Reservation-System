import Joi from 'joi';

export const reservationSchema = Joi.object({
  showtimeId: Joi.string().trim().required().guid(),
  seatId: Joi.string().trim().required().guid(),
});
