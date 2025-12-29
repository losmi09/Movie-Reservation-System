import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import validateBody from '../utils/validateBody.js';
import convertNumericStringsToNumbers from '../utils/convertNumericStrings.js';
import * as crudService from '../services/crudService.js';

const sendResponse = (res, statusCode, data) =>
  res.status(statusCode).json({ data });

export const getAll = model =>
  catchAsync(async (req, res) => {
    if (model === 'hall') req.query.cinemaId = Number(req.params.cinemaId);

    const { docs, metaData } = await crudService.getAll(model, req.query);

    res.status(200).json({ data: docs, metaData });
  });

export const getOne = model =>
  catchAsync(async (req, res, next) => {
    const paramsClone = convertNumericStringsToNumbers(req.params);

    const doc = await crudService.getOne(model, paramsClone);

    if (!doc) return next(new AppError(`No ${model} found with this ID`, 404));

    sendResponse(res, 200, doc);
  });

export const createOne = model =>
  catchAsync(async (req, res, next) => {
    const { body: data } = req;

    if (model === 'hall') data.cinemaId = +req.params.cinemaId;

    const error = validateBody(model, data);

    if (error) return next(error);

    const newDoc = await crudService.createOne(model, data);

    sendResponse(res, 201, newDoc);
  });

export const updateOne = model =>
  catchAsync(async (req, res, next) => {
    const { body: data } = req;

    const error = validateBody(model, data, true);

    if (error) return next(error);

    const paramsClone = convertNumericStringsToNumbers(req.params);

    const updatedDoc = await crudService.updateOne(model, paramsClone, data);

    sendResponse(res, 200, updatedDoc);
  });

export const deleteOne = model =>
  catchAsync(async (req, res) => {
    const paramsClone = convertNumericStringsToNumbers(req.params);

    await crudService.deleteOne(model, paramsClone);

    res.status(204).end();
  });
