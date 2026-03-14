import { selectSingleDoc } from './prismaSelects.js';
import { prisma } from '../server.js';

export const getRow = async (rowId, fields) =>
  await prisma.row.findUnique({
    where: { id: rowId },
    ...(fields && { select: fields }),
  });

export const createRow = async data =>
  await prisma.row.create({ data, select: selectSingleDoc.row() });
