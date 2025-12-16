import * as movieRepository from '../repositories/movieRepository.js';

export const createMovie = async movieData =>
  await movieRepository.createMovie(movieData);
