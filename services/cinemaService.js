import * as cinemaRepository from '../repositories/cinemaRepository.js';

export const createCinema = async cinemaData =>
  cinemaRepository.createCinema(cinemaData);
