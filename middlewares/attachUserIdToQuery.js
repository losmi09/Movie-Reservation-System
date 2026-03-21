export const attachUserIdToQuery = (req, res, next) => {
  req.query.userId = req.user.id;

  next();
};
