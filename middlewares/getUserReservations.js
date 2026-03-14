export const getUserReservations = (req, res, next) => {
  req.query.userId = req.user.id;

  next();
};
