import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import validateBody from '../validation/validateBody.js';
import sendResponse from '../utils/sendResponse.js';
import { redisClient } from '../server.js';
import formatResponse from '../mappers/formatResponse.js';
import * as crudService from '../services/crudService.js';

export const getAll = model =>
  catchAsync(async (req, res) => {
    const { query, cacheKey } = req;

    const { data, meta } = await crudService.getAll(model, { ...query });

    if (cacheKey)
      await redisClient.set(cacheKey, JSON.stringify({ data, meta }), {
        EX: 300,
      });

    res.status(200).json({ data, meta });
  });

const getFormatedDoc = (model, doc) => formatResponse?.[model]?.(doc) ?? doc;

export const getOne = model =>
  catchAsync(async (req, res, next) => {
    const doc = await crudService.getOne(model, req.params.id);

    if (!doc) return next(new AppError(`No ${model} found with this ID`, 404));

    const finalDoc = getFormatedDoc(model, doc);

    const { cacheKey } = req;

    if (cacheKey)
      await redisClient.set(cacheKey, JSON.stringify(finalDoc), {
        EX: 300,
      });

    sendResponse(res, finalDoc);
  });

export const createOne = model =>
  catchAsync(async (req, res, next) => {
    const data = { ...req.body };

    // Parent field comes from nested route, e.g. /cinemas/:id/halls
    const parentIds = {
      hall: 'cinemaId',
      row: 'hallId',
      seat: 'rowId',
      showtime: 'movieId',
      reservation: 'showtimeId',
    };

    const parentId = parentIds[model];

    if (parentId) data[parentId] = req.params.id;

    const error = await validateBody({
      model,
      body: data,
      userId: req.user.id,
    });

    if (error) return next(error);

    const newDoc = await crudService.createOne(model, data);

    sendResponse(res, getFormatedDoc(model, newDoc), 201);
  });

export const updateOne = model =>
  catchAsync(async (req, res, next) => {
    const data = { ...req.body };

    const { id } = req.params;

    const error = await validateBody({
      model,
      body: data,
      id,
      isUpdating: true,
      userId: req.user.id,
    });

    if (error) return next(error);

    const updatedDoc = await crudService.updateOne(model, id, data);

    sendResponse(res, getFormatedDoc(model, updatedDoc));
  });

export const deleteOne = model =>
  catchAsync(async (req, res) => {
    await crudService.deleteOne(model, req.params.id);

    res.status(204).end();
  });
