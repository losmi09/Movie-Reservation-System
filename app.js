import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import { xss } from 'express-xss-sanitizer';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import AppError from './utils/appError.js';
import globalErrorHandler from './controllers/errorController.js';
import { router as movieRouter } from './routes/movieRoutes.js';
import { router as authRouter } from './routes/authRoutes.js';
import { router as userRouter } from './routes/userRoutes.js';
import { router as cinemaRouter } from './routes/cinemaRoutes.js';
import { idRouter as hallRouter } from './routes/hallRoutes.js';
import { idRouter as seatRouter } from './routes/seatRoutes.js';
import { secondRouter as showtimeRouter } from './routes/showtimeRoutes.js';
import { thirdRouter as reservationRouter } from './routes/reservationRoutes.js';

// Initialize express app
const app = express();

// Secure HTTP headers
app.use(helmet());

// Set up CORS
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

// Rate limit
const limit = rateLimit({
  max: Number(process.env.RATE_LIMIT_MAX),
  windowMs: Number(process.env.RATE_LIMIT_WINDOW),
  message: 'Too many requests. Please try again later',
});

// Rate limit for auth routes
const authLimit = rateLimit({
  max: Number(process.env.AUTH_RATE_LIMIT_MAX),
  windowMs: Number(process.env.AUTH_RATE_LIMIT_WINDOW),
  message: 'Too many requests. Please try again later',
});

// Body parser (limit payload to 10 kilobytes)
app.use(express.json({ limit: '10kb' }));

// Parse cookies into req.cookies
app.use(cookieParser());

// Sanitize XSS
app.use(xss());

// Prevent HTTP parameter pollution
app.use(hpp());

// Compress HTTP response size
app.use(compression());

// Log requests in development
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Routes
app.use('/api/v1/movies', limit, movieRouter);
app.use('/api/v1/auth', authLimit, authRouter);
app.use('/api/v1/users', limit, userRouter);
app.use('/api/v1/cinemas', limit, cinemaRouter);
app.use('/api/v1/halls', limit, hallRouter);
app.use('/api/v1/seats', limit, seatRouter);
app.use('/api/v1/showtimes', limit, showtimeRouter);
app.use('/api/v1/reservations', limit, reservationRouter);

// Handle unhandled routes
app.use((req, res, next) =>
  next(new AppError('The requested resource was not found', 404))
);

app.use(globalErrorHandler);

export default app;
