import { generateSlugObject } from './utils/slugObject.js';
import * as redisService from '../services/redisService.js';
import * as movieRepository from '../repositories/movieRepository.js';

const invalidateMovieCache = () => redisService.invalidateCache('movie');

export const createMovie = async data => {
  const movie = await movieRepository.createMovie({
    ...data,
    ...generateSlugObject(data.title),
  });

  await invalidateMovieCache();

  return movie;
};

export const updateMovie = async (movieId, data) => {
  const { title } = data;

  const updatedMovie = await movieRepository.updateMovie(
    movieId,
    { ...data, ...(title && generateSlugObject(title)) },
    true,
  );

  await invalidateMovieCache();

  return updatedMovie;
};

export const saveMoviePoster = (movieId, fileName) =>
  movieRepository.saveMoviePoster(movieId, fileName);

export const updateMovieReviewStats = (tx, movieId) =>
  movieRepository.updateMovieReviewStats(tx, movieId);
