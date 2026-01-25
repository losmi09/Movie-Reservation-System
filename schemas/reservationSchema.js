import Joi from 'joi';

const reservationSchema = Joi.object({
  showtimeId: Joi.string().required().guid(),
  seatId: Joi.string().required().guid(),
  userId: Joi.string().required().guid(),
});

export default reservationSchema;
