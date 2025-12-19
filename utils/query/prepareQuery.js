const paginate = query => {
  const { page = 1, limit = 20 } = query;

  const skip = (Number(page) - 1) * Number(limit);

  return { skip, limit: Number(limit) };
};

const sort = query =>
  query.sort?.split(',').map(sort => {
    return sort.startsWith('-')
      ? { [sort.slice(1)]: 'desc' }
      : { [sort]: 'asc' };
  });

const selectSpecificFields = query => {
  const specificFields = {};

  query.fields?.split(',').forEach(field => (specificFields[field] = true));

  // If the fields are not specified in the query, return null which selects all fields
  return Object.keys(specificFields).length > 0 ? specificFields : null;
};

const prepareQuery = query => {
  const queryClone = structuredClone(query);

  const { skip, limit } = paginate(queryClone);

  const selectFields = selectSpecificFields(queryClone);

  const orderBy = sort(queryClone);

  const excludeFromQuery = ['page', 'limit', 'sort', 'fields'];

  excludeFromQuery.forEach(param => delete queryClone[param]);

  return { queryClone, skip, limit, orderBy, selectFields };
};

export default prepareQuery;
