import { catchAsync } from '../utils/catchAsync.js';
import { formatResponse } from '../mappers/formatResponse.js';
import { sendResponse } from './utils/sendResponse.js';
import * as crudController from './crudController.js';
import * as rowService from '../services/rowService.js';

export const getAllRows = crudController.getAll('row');

export const getRow = crudController.getOne('row');

export const createRow = catchAsync(async (req, res) => {
  const { body, params } = req;

  const row = await rowService.createRow({ ...body, hallId: params.id });

  sendResponse(res, formatResponse.row(row), 201);
});

export const updateRow = crudController.updateOne('row');

export const deleteRow = crudController.deleteOne('row');
