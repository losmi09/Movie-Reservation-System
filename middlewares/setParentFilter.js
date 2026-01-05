// E.g. used to get all the halls belonging to a specific cinema
const setParentFilter = parent => (req, res, next) => {
  req.query[`${parent}Id`] = Number(req.params.id);

  next();
};

export default setParentFilter;
