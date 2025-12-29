import { Router } from 'express';
import validateId from '../middlewares/validateId.js';
import * as hallController from '../controllers/hallController.js';
import * as authMiddleware from '../middlewares/auth.js';

const router = Router({ mergeParams: true });

router
  .route('/')
  .get(hallController.getAllHalls)
  .post(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    hallController.createHall
  );

router.use(authMiddleware.protect);

router
  .route('/:id')
  .get(validateId, hallController.getHall)
  .patch(
    validateId,
    authMiddleware.restrictTo('admin'),
    hallController.updatehall
  )
  .delete(
    validateId,
    authMiddleware.restrictTo('admin'),
    hallController.deleteHall
  );

export default router;
