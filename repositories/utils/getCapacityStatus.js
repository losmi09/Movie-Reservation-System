import { prisma } from '../../server.js';

export const getCapacityStatus = async (model, id) => {
  const config = {
    hall: { field: 'maxRows', child: 'Row' },
    row: { field: 'seatCapacity', child: 'Seat' },
  };

  const { field, child } = config[model];

  const result = await prisma[model].findUnique({
    where: { id },
    select: { [field]: true, _count: { select: { [child]: true } } },
  });

  // No document found with provided ID
  if (!result) return null;

  return { capacity: result[field], count: result._count[child] };
};
