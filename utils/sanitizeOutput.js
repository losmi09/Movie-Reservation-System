const sanitizeOutput = user => {
  const userClone = structuredClone(user);

  const sensitiveFields = [
    'password',
    'passwordChangedAt',
    'passwordResetToken',
    'passwordResetTokenExpiry',
    'emailVerificationToken',
    'emailVerificationTokenExpiry',
    'isVerified',
    'isActive',
    'refreshToken',
  ];

  sensitiveFields.forEach(field => (userClone[field] = undefined));

  return userClone;
};

export default sanitizeOutput;
