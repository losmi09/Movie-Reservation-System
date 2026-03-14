import { prisma } from '../../server.js';

export const checkIfRecordExists = async (model, id) => {
  const exists = await prisma[model].findUnique({
    where: { id },
    select: { _count: true },
  });

  // exists returns either count object or null, so !! will return boolean
  return !!exists;
};
