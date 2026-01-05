import prisma from '../server.js';

export const saveMoviePoster = async (movieId, fileName) =>
  await prisma.movie.update({
    where: { id: movieId },
    data: { posterImage: fileName },
  });
