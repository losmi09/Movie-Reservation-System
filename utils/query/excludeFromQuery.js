const excludeFromQuery = (query, ...fields) =>
  fields.forEach(param => delete query[param]);

export default excludeFromQuery;
