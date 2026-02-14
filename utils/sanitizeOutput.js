const sanitizeOutput = user => {
  const {
    password,
    passwordChangedAt,
    passwordResetToken,
    passwordResetTokenExpiry,
    emailVerificationToken,
    emailVerificationTokenExpiry,
    isVerified,
    isActive,
    ...cleanUser
  } = user;

  return cleanUser;
};

export default sanitizeOutput;
