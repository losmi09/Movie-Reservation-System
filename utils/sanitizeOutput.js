const sanitizeOutput = user => {
  const sensitiveFields = [
    'password',
    'passwordChangedAt',
    'passwordResetToken',
    'passwordResetTokenExpiry',
    'emailVerificationToken',
    'emailVerificationTokenExpiry',
    'isVerified',
    'isActive',
  ];

  sensitiveFields.forEach(field => (user[field] = undefined));
};

export default sanitizeOutput;
