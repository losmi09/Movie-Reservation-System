import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import validateBody from '../utils/validateBody.js';
import * as crudService from '../services/crudService.js';

const sendResponse = (res, statusCode, data) =>
  res.status(statusCode).json({ data });

export const getAll = model =>
  catchAsync(async (req, res) => {
    if (model === 'hall') req.query.cinemaId = Number(req.params.id);

    if (model === 'seat') req.query.hallId = Number(req.params.id);

    if (model === 'showtime') req.query.movieId = Number(req.params.id);

    const { docs, metaData } = await crudService.getAll(model, req.query);

    res.status(200).json({ data: docs, metaData });
  });

export const getOne = model =>
  catchAsync(async (req, res, next) => {
    const doc = await crudService.getOne(model, Number(req.params.id));

    if (!doc) return next(new AppError(`No ${model} found with this ID`, 404));

    sendResponse(res, 200, doc);
  });

export const createOne = model =>
  catchAsync(async (req, res, next) => {
    const { body: data } = req;

    if (model === 'hall') data.cinemaId = Number(req.params.id);

    if (model === 'seat') data.hallId = Number(req.params.id);

    if (model === 'showtime') data.movieId = Number(req.params.id);

    const error = await validateBody(model, data);

    if (error) return next(error);

    const newDoc = await crudService.createOne(model, data);

    sendResponse(res, 201, newDoc);
  });

export const updateOne = model =>
  catchAsync(async (req, res, next) => {
    const { body: data } = req;

    const error = await validateBody(model, data, true, Number(req.params.id));

    if (error) return next(error);

    const updatedDoc = await crudService.updateOne(
      model,
      Number(req.params.id),
      data
    );

    sendResponse(res, 200, updatedDoc);
  });

export const deleteOne = model =>
  catchAsync(async (req, res) => {
    await crudService.deleteOne(model, Number(req.params.id));

    res.status(204).end();
  });
