import { catchAsync } from '../utils/catchAsync.js';
import { sendResponse } from './utils/sendResponse.js';
import * as crudController from './crudController.js';
import * as hallService from '../services/hallService.js';

export const getAllHalls = crudController.getAll('hall');

export const getHall = crudController.getOne('hall');

export const createHall = catchAsync(async (req, res) => {
  const { id: cinemaId } = req.params;

  const hall = await hallService.createHall({ ...req.body, cinemaId });

  sendResponse(res, hall, 201);
});

export const updateHall = crudController.updateOne('hall');

export const deleteHall = crudController.deleteOne('hall');
