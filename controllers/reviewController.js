import { catchAsync } from '../utils/catchAsync.js';
import { sendResponse } from './utils/sendResponse.js';
import * as crudController from './crudController.js';
import * as reviewService from '../services/reviewService.js';

export const getAllReviews = crudController.getAll('review');

export const getReview = crudController.getOne('review');

export const createReview = catchAsync(async (req, res) => {
  const { params, body, user } = req;

  const review = await reviewService.createReview(
    { ...body, movieId: params.id },
    user.id,
  );

  sendResponse(res, review, 201);
});

export const updateReview = catchAsync(async (req, res) => {
  const { params, user, body } = req;

  const updatedReview = await reviewService.updateReview(params.id, user.id, {
    ...body,
  });

  sendResponse(res, updatedReview);
});

export const deleteReview = catchAsync(async (req, res) => {
  const { params, user } = req;

  await reviewService.deleteReview(params.id, user.id);

  sendResponse(res, null, 204);
});
