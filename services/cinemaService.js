import { generateSlugObject } from './utils/slugObject.js';
import * as cinemaRepository from '../repositories/cinemaRepository.js';
import * as redisService from '../services/redisService.js';

export const getCinema = (cinemaId, fields) =>
  cinemaRepository.getCinema(cinemaId, fields);

export const createCinema = async data => {
  const cinema = await cinemaRepository.createCinema({
    ...data,
    ...generateSlugObject(data.name),
  });

  await redisService.invalidateCache('cinema');

  return cinema;
};

export const updateCinema = async (cinemaId, data) => {
  const { name } = data;

  const updatedCinema = await cinemaRepository.updateCinema(cinemaId, {
    ...data,
    ...(name && generateSlugObject(name)),
  });

  await redisService.invalidateCache('cinema');

  return updatedCinema;
};
