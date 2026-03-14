import { catchAsync } from '../utils/catchAsync.js';
import { sendResponse } from './utils/sendResponse.js';
import * as crudController from './crudController.js';
import * as reviewService from '../services/reviewService.js';

export const getAllReviews = crudController.getAll('review');

export const getReview = crudController.getOne('review');

export const createReview = catchAsync(async (req, res) => {
  const review = await reviewService.createReview({ ...req.body });

  sendResponse(res, review, 201);
});

export const updateReview = catchAsync(async (req, res) => {
  const updatedReview = await reviewService.updateReview(
    req.params.id,
    req.user.id,
    { ...req.body },
  );

  sendResponse(res, updatedReview);
});

export const deleteReview = catchAsync(async (req, res) => {
  await reviewService.deleteReview(req.params.id, req.user.id);

  sendResponse(res, null, 204);
});
