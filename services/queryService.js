import { paginate } from './paginationService.js';
import { convertNumericStringsToNumbers } from '../utils/convertNumericStrings.js';
import { selectForQueryFields } from '../repositories/prismaSelects.js';

export const sort = query =>
  query.sort?.split(',').map(sort => {
    return sort.startsWith('-')
      ? { [sort.slice(1)]: 'desc' }
      : { [sort]: 'asc' };
  });

export const selectSpecificFields = query => {
  const specificFields = {};

  query.fields?.split(',').forEach(field => {
    const fieldConfig = selectForQueryFields[field];
    if (fieldConfig) specificFields[field] = { select: fieldConfig() };
    else specificFields[field] = true;
  });

  // If the fields are not specified in the query, return null which selects all fields
  return Object.keys(specificFields).length > 0 ? specificFields : null;
};

export const prepareQuery = query => {
  const cleanQuery = convertNumericStringsToNumbers(query);

  const { skip, limit } = paginate(cleanQuery);

  const selectFields = selectSpecificFields(cleanQuery);

  const orderBy = sort(cleanQuery);

  const { page, limit: limitQ, sort: sortQ, fields, ...filters } = cleanQuery;

  return { filters, skip, limit, orderBy, selectFields };
};
