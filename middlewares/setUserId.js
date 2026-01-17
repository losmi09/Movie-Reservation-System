const setUserId = (req, res, next) => {
  req.body.userId = req.user.id;

  next();
};

export default setUserId;
