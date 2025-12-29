import excludeFromQuery from './excludeFromQuery.js';
import convertNumericStringsToNumbers from '../convertNumericStrings.js';

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
  let queryClone = structuredClone(query);

  queryClone = convertNumericStringsToNumbers(queryClone);

  const { skip, limit } = paginate(queryClone);

  const selectFields = selectSpecificFields(queryClone);

  const orderBy = sort(queryClone);

  excludeFromQuery(queryClone, 'page', 'limit', 'sort', 'fields');

  return { queryClone, skip, limit, orderBy, selectFields };
};

export default prepareQuery;
