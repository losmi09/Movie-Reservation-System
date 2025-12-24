import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import AppError from './utils/appError.js';
import globalErrorHandler from './controllers/errorController.js';
import { router as movieRouter } from './routes/movieRoutes.js';
import { router as authRouter } from './routes/authRoutes.js';

const app = express();

app.use(helmet());

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

const limit = rateLimit({
  max: Number(process.env.RATE_LIMIT_MAX),
  windowMs: Number(process.env.RATE_LIMIT_WINDOW),
  message: 'Too many requests. Please try again later',
});

const authLimit = rateLimit({
  max: Number(process.env.AUTH_RATE_LIMIT_MAX),
  windowMs: Number(process.env.AUTH_RATE_LIMIT_WINDOW),
  message: 'Too many requests. Please try again later',
});

app.use(express.json({ limit: '10kb' }));

app.use(cookieParser());

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use('/api/v1/movies', limit, movieRouter);
app.use('/api/v1/auth', authLimit, authRouter);

app.use((req, res, next) =>
  next(new AppError('The requested resource was not found', 404))
);

app.use(globalErrorHandler);

export default app;
