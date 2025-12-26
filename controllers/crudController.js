import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import validateBody from '../utils/validateBody.js';
import * as crudService from '../services/crudService.js';

const sendResponse = (res, statusCode, data) =>
  res.status(statusCode).json({ data });

export const getAll = model =>
  catchAsync(async (req, res) => {
    const { docs, metaData } = await crudService.getAll(model, req.query);

    res.status(200).json({ data: docs, metaData });
  });

export const getOne = model =>
  catchAsync(async (req, res, next) => {
    const doc = await crudService.getOne(model, req.params.id);

    if (!doc) return next(new AppError(`No ${model} found with this ID`, 404));

    sendResponse(res, 200, doc);
  });

export const createOne = model =>
  catchAsync(async (req, res, next) => {
    const { body: data } = req;

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

    const updatedDoc = await crudService.updateOne(model, req.params.id, data);

    sendResponse(res, 200, updatedDoc);
  });

export const deleteOne = model =>
  catchAsync(async (req, res) => {
    await crudService.deleteOne(model, req.params.id);

    res.status(204).end();
  });
