import Joi from 'joi';

const cinemaSchema = Joi.object({
  name: Joi.string().required().trim(),
  city: Joi.string().required().trim(),
  address: Joi.string().required().trim(),
  phone: Joi.string().required().trim(),
  email: Joi.string().email().required().trim(),
});

export default cinemaSchema;
