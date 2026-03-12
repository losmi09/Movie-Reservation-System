import Joi from 'joi';

const reservationSchema = Joi.object({
  showtimeId: Joi.string().trim().required().guid(),
  seatId: Joi.string().trim().required().guid(),
  userId: Joi.string().trim().required().guid(),
});

export default reservationSchema;
