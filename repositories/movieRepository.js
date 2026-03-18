import { prisma } from '../server.js';

export const createMovie = async data => await prisma.movie.create({ data });

export const updateMovie = async (movieId, data, selectAllFields) =>
  await prisma.movie.update({
    where: { id: movieId },
    data,
    ...(!selectAllFields && { select: { id: true } }),
  });

export const saveMoviePoster = async (movieId, fileName) =>
  await prisma.movie.update({
    where: { id: movieId },
    data: { posterImage: fileName },
  });

export const getMovieReviewStats = async (tx, movieId) => {
  const stats = await tx.review.aggregate({
    where: { movieId },
    _count: true,
    _avg: { rating: true },
  });

  return { reviewsCount: stats._count, averageRating: stats._avg.rating ?? 0 };
};

export const updateMovieReviewStats = async (tx, movieId) => {
  const { reviewsCount, averageRating } = await getMovieReviewStats(
    tx,
    movieId,
  );

  await tx.movie.update({
    where: { id: movieId },
    data: { reviewsCount, averageRating },
    select: { id: true },
  });
};
