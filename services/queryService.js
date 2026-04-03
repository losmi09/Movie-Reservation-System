import { convertNumericStringsToNumbers } from '../utils/convertNumericStrings.js';
import { selectForQueryFields } from '../repositories/prismaSelects.js';

export const DEFAULT_PAGE_SIZE = 20;

export const parseSelectFields = fieldsParam => {
  if (!fieldsParam) return;

  const specificFields = {};

  fieldsParam.split(',').forEach(field => {
    // Get predefined select config for field (used for relations)
    const fieldConfig = selectForQueryFields[field];
    if (fieldConfig) specificFields[field] = { select: fieldConfig() };
    else specificFields[field] = true;
  });

  return specificFields;
};

export const prepareQuery = query => {
  const cleanQuery = convertNumericStringsToNumbers(query);

  const selectFields = parseSelectFields(cleanQuery.fields);

  const { cursor, limit = DEFAULT_PAGE_SIZE, fields, ...filters } = cleanQuery;

  return { cursor, pageSize: limit, filters, selectFields };
};
