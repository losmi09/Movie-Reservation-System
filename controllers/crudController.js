import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/appError.js';
import { sendResponse } from './utils/sendResponse.js';
import { redisClient } from '../server.js';
import { formatResponse } from '../mappers/formatResponse.js';
import * as crudService from '../services/crudService.js';

const setCache = async (key, data) =>
  await redisClient.set(key, JSON.stringify(data), {
    EX: Number(process.env.CACHE_EXPIRY),
  });

export const getAll = model =>
  catchAsync(async (req, res) => {
    const { query, cacheKey } = req;

    const { data, meta } = await crudService.getAll(model, { ...query });

    if (cacheKey) await setCache(cacheKey, { data, meta });

    res.status(200).json({ data, meta });
  });

const getFormatedDoc = (model, doc) => formatResponse?.[model]?.(doc) ?? doc;

export const getOne = model =>
  catchAsync(async (req, res, next) => {
    const doc = await crudService.getOne(model, req.params.id);

    if (!doc) return next(new AppError(`No ${model} found with this ID`, 404));

    const finalDoc = getFormatedDoc(model, doc);

    const { cacheKey } = req;

    if (cacheKey) await setCache(cacheKey, finalDoc);

    sendResponse(res, finalDoc);
  });

export const updateOne = model =>
  catchAsync(async (req, res) => {
    const updatedDoc = await crudService.updateOne(model, req.params.id, {
      ...req.body,
    });

    sendResponse(res, getFormatedDoc(model, updatedDoc));
  });

export const deleteOne = model =>
  catchAsync(async (req, res) => {
    await crudService.deleteOne(model, req.params.id);

    sendResponse(res, null, 204);
  });
