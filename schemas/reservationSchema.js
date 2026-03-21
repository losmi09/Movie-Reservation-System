import Joi from 'joi';

export const reservationSchema = Joi.object({
  seatId: Joi.string().trim().required().guid(),
});
