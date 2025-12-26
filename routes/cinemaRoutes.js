import { Router } from 'express';
import * as cinemaController from '../controllers/cinemaController.js';

export const router = Router();

router.route('/').post(cinemaController.createCinema);
