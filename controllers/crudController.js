import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import validateBody from '../utils/validateBody.js';
import sendResponse from '../utils/sendResponse.js';
import * as crudService from '../services/crudService.js';

// Parent field comes from nested route e.g. /cinemas/:id/halls where is cinema parent to hall
const parentFields = {
  hall: 'cinemaId',
  seat: 'hallId',
  showtime: 'movieId',
  reservation: 'showtimeId',
};

export const getAll = model =>
  catchAsync(async (req, res) => {
    // Parent id for showtime and reservation is only used to set in req.body when creating
    if (model !== 'showtime' && model !== 'reservation' && parentFields[model])
      req.query[parentFields[model]] = Number(req.params.id);

    const { docs, metaData } = await crudService.getAll(model, req.query);

    res.status(200).json({ data: docs, meta: metaData });
  });

export const getOne = model =>
  catchAsync(async (req, res, next) => {
    const doc = await crudService.getOne(model, Number(req.params.id));

    if (!doc) return next(new AppError(`No ${model} found with this ID`, 404));

    sendResponse(res, doc);
  });

export const createOne = model =>
  catchAsync(async (req, res, next) => {
    const { body: data } = req;

    if (parentFields[model]) data[parentFields[model]] = Number(req.params.id);

    if (model === 'reservation') data.userId = req.user.id;

    const error = await validateBody(model, data);

    if (error) return next(error);

    const newDoc = await crudService.createOne(model, data);

    sendResponse(res, newDoc, 201);
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

    sendResponse(res, updatedDoc);
  });

export const deleteOne = model =>
  catchAsync(async (req, res) => {
    await crudService.deleteOne(model, Number(req.params.id));

    res.status(204).end();
  });
