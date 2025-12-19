import * as movieRepository from '../repositories/movieRepository.js';
import getMetaData from '../utils/query/getMetaData.js';

export const getAllMovies = async query => {
  const movies = await movieRepository.getAllMovies(query);

  const metaData = await getMetaData(query, 'movie');

  return { movies, metaData };
};

export const createMovie = async movieData =>
  await movieRepository.createMovie(movieData);
