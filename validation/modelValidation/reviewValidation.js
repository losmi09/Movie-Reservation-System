import reviewSchema from '../../schemas/reviewSchema.js';
import validateSchema from '../utils/validateSchema.js';
import throwValidationError from '../utils/throwValidationError.js';
import checkIfParentExists from '../utils/checkIfParentExists.js';

const validateReview = async (data, isUpdating) => {
  const errorObj = validateSchema(reviewSchema, data);

  if (!isUpdating) {
    // Verify that movie exists
    const movie = await checkIfParentExists('movie', data.movieId, errorObj);

    if (!movie)
      return throwValidationError('movieId', 'No movie found with this ID');
  }

  return errorObj.details.length ? errorObj : undefined;
};

export default validateReview;
