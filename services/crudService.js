import slugify from 'slugify';
import getMetaData from '../utils/query/getMetaData.js';
import * as crudRepository from '../repositories/crudRepository.js';
import * as showtimeService from '../services/showtimeService.js';
import * as reservationService from '../services/reservationService.js';
import * as redisService from '../services/redisService.js';

export const getAll = async (model, query) => {
  const [data, meta] = await Promise.all([
    crudRepository.getAll(model, query),
    getMetaData(model, query),
  ]);

  return { data, meta };
};

export const getOne = async (model, id) =>
  await crudRepository.getOne(model, id);

const addSlugToData = (model, data) => {
  const slugs = { movie: 'title', cinema: 'name' };

  const slugField = slugs[model];

  const value = data[slugField];

  if (!slugField || !value) return;

  data.slug = slugify(value, { lower: true });
};

export const createOne = async (model, data) => {
  if (model === 'showtime')
    showtimeService.convertShowtimeDatesToISOFormat(data);

  if (model === 'reservation') {
    const { showtimeId } = data;

    const { hallId } = await crudRepository.getOne('showtime', showtimeId);

    // If all seats are reserved, make a reservation with status of waitlist
    await reservationService.addToWaitlist(showtimeId, hallId, data);
  }

  addSlugToData(model, data);

  const createdDoc = await crudRepository.createOne(model, data);

  await redisService.invalidateCache(model);

  return createdDoc;
};

export const updateOne = async (model, id, data) => {
  if (model === 'reservation')
    await reservationService.handleReservationCancellation(id);

  addSlugToData(model, data);

  const updatedDoc = await crudRepository.updateOne(model, id, data);

  await redisService.invalidateCache(model);

  return updatedDoc;
};

export const deleteOne = async (model, id) => {
  await crudRepository.deleteOne(model, id);

  await redisService.invalidateCache(model);
};
