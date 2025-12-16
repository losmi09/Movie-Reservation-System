import { Router } from 'express';
import * as movieController from '../controllers/movieController.js';

export const router = Router();

router.route('/').post(movieController.createMovie);
