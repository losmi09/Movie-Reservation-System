import * as crudController from './crudController.js';

export const getAllRows = crudController.getAll('row');

export const getRow = crudController.getOne('row');

export const createRow = crudController.createOne('row');

export const updateRow = crudController.updateOne('row');

export const deleteRow = crudController.deleteOne('row');
