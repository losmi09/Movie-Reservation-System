import Joi from 'joi';

const reservationSchema = Joi.object({
  showtimeId: Joi.string().guid(),
  seatId: Joi.string().guid(),
  userId: Joi.string().guid(),
});

export default reservationSchema;
