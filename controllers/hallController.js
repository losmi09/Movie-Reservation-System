import * as crudController from './crudController.js';

export const getAllHalls = crudController.getAll('hall');

export const getHall = crudController.getOne('hall');

export const createHall = crudController.createOne('hall');

export const updateHall = crudController.updateOne('hall');

export const deleteHall = crudController.deleteOne('hall');
