import getMetaData from '../utils/query/getMetaData.js';
import * as cinemaRepository from '../repositories/cinemaRepository.js';

export const getAllCinemas = async query => {
  const cinemas = await cinemaRepository.getAllCinemas(query);

  const metaData = await getMetaData(query, 'cinema');

  return { cinemas, metaData };
};

export const createCinema = async cinemaData =>
  cinemaRepository.createCinema(cinemaData);
