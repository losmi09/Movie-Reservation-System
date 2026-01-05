import * as movieRepository from '../repositories/movieRepository.js';

export const saveMoviePoster = async (movieId, fileName) =>
  await movieRepository.saveMoviePoster(movieId, fileName);
