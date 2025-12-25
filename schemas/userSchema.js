import Joi from 'joi';

const emailField = {
  email: Joi.string().email().lowercase().required().trim(),
};

const passwordCurrentField = {
  passwordCurrent: Joi.string().required().trim(),
};

const passwordField = {
  password: Joi.string()
    .invalid(Joi.ref('passwordCurrent'))
    .required()
    .messages({ 'any.invalid': 'New password cannot be the current one' })
    .min(8)
    .trim(),
};

const passwordConfirmField = {
  passwordConfirm: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({ 'any.only': 'Passwords do not match' }),
};

// Used for forgot-password
export const emailSchema = Joi.object({ ...emailField });

export const loginSchema = Joi.object({
  ...emailField,
  password: Joi.string().required().trim(),
});

// Used for password reset
export const passwordSchema = Joi.object({
  ...passwordCurrentField,
  ...passwordField,
  ...passwordConfirmField,
});

// Used for user update
export const updateUserSchema = Joi.object({
  firstName: Joi.string().trim(),
  lastName: Joi.string().trim(),
  email: Joi.string().email().trim(),
});

// Used for registration
const userSchema = Joi.object({
  firstName: Joi.string().required().trim(),
  lastName: Joi.string().required().trim(),
  ...emailField,
  ...passwordField,
  ...passwordConfirmField,
});

export default userSchema;
