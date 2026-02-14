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
    refreshToken,
    ...cleanUser
  } = user;

  return cleanUser;
};

export default sanitizeOutput;
