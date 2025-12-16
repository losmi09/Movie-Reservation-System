import express from 'express';
import AppError from './utils/appError.js';
import globalErrorHandler from './controllers/errorController.js';
import { router as movieRouter } from './routes/movieRoutes.js';

const app = express();

app.use(express.json({ limit: '10kb' }));

app.use('/api/v1/movies', movieRouter);

app.use((req, res, next) =>
  next(new AppError('The requested resource was not found', 404))
);

app.use(globalErrorHandler);

export default app;
