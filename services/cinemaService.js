import slugify from 'slugify';
import * as cinemaRepository from '../repositories/cinemaRepository.js';
import * as redisService from '../services/redisService.js';

export const getCinema = (cinemaId, fields) =>
  cinemaRepository.getCinema(cinemaId, fields);

export const createCinema = async data => {
  const cinema = cinemaRepository.createCinema({
    ...data,
    slug: slugify(data.name, { lower: true }),
  });

  await redisService.invalidateCache('cinema');

  return cinema;
};

export const updateCinema = async (cinemaId, data) => {
  const { name } = data;

  const updatedCinema = cinemaRepository.updateCinema(cinemaId, {
    ...data,
    ...(name && { slug: slugify(name, { lower: true }) }),
  });

  await redisService.invalidateCache('cinema');

  return updatedCinema;
};
