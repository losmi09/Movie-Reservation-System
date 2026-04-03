import { prisma } from '../server.js';

export const getAll = async (
  model,
  decodedCursorToken,
  pageSize,
  filters,
  selectFields,
) => {
  const { cursorCreatedAt, cursorId } = decodedCursorToken ?? {};

  let cursorQuery;

  if (cursorCreatedAt && cursorId)
    cursorQuery = {
      OR: [
        { createdAt: { gt: cursorCreatedAt } },
        {
          AND: [
            { createdAt: { equals: cursorCreatedAt } },
            { id: { gt: cursorId } },
          ],
        },
      ],
    };

  return await prisma[model].findMany({
    // Fetch one extra record to determine if there is a next page
    take: pageSize + 1,
    where: { ...filters, ...cursorQuery },
    orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
    // Always include id and createdAt to generate the next cursor
    select: { ...selectFields, id: true, createdAt: true },
  });
};

// "baseConfig" refers to the object that would be passed without select config
const withSelect = (baseConfig, select) =>
  select ? { ...baseConfig, select } : baseConfig;

export const getOne = async (model, id, select) =>
  await prisma[model].findUnique(withSelect({ where: { id } }, select));

export const updateOne = async (model, id, data, select) =>
  await prisma[model].update(withSelect({ where: { id }, data }, select));

export const deleteOne = async (model, id) =>
  await prisma[model].delete({ where: { id } });
