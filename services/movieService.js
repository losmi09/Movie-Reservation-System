import slugify from 'slugify';
import * as redisService from '../services/redisService.js';
import * as movieRepository from '../repositories/movieRepository.js';

export const createMovie = async data => {
  const movie = movieRepository.createMovie({
    ...data,
    slug: slugify(data.title, { lower: true }),
  });

  await redisService.invalidateCache('movie');

  return movie;
};

export const updateMovie = async (movieId, data) => {
  const { title } = data;

  const updatedMovie = movieRepository.updateMovie(
    movieId,
    {
      ...data,
      ...(title && { slug: slugify(title, { lower: true }) }),
    },
    true,
  );

  await redisService.invalidateCache('movie');

  return updatedMovie;
};

export const saveMoviePoster = (movieId, fileName) =>
  movieRepository.saveMoviePoster(movieId, fileName);

export const updateMovieReviewStats = (tx, movieId) =>
  movieRepository.updateMovieReviewStats(tx, movieId);
