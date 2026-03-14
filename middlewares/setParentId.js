export const setParentId = parent => (req, res, next) => {
  req.body[`${parent}Id`] = req.params.id;

  next();
};
