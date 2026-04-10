import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import { xss } from 'express-xss-sanitizer';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { AppError } from './utils/appError.js';
import { globalErrorHandler } from './controllers/errorController.js';
import { movieRouter } from './routes/movieRoutes.js';
import { authRouter } from './routes/authRoutes.js';
import { userRouter } from './routes/userRoutes.js';
import { cinemaRouter } from './routes/cinemaRoutes.js';
import { hallRouter } from './routes/hallRoutes.js';
import { rowRouter } from './routes/rowRoutes.js';
import { seatRouter } from './routes/seatRoutes.js';
import { showtimeRouter } from './routes/showtimeRoutes.js';
import { allReservationRouter as reservationRouter } from './routes/reservationRoutes.js';
import { reviewRouter } from './routes/reviewRoutes.js';

const {
  FRONTEND_URL,
  RATE_LIMIT_MAX,
  RATE_LIMIT_WINDOW,
  AUTH_RATE_LIMIT_MAX,
  AUTH_RATE_LIMIT_WINDOW,
  NODE_ENV,
} = process.env;

// Initialize express app
export const app = express();

// Set secure HTTP headers
app.use(helmet());

// Set up CORS
app.use(cors({ origin: FRONTEND_URL, credentials: true }));

// Rate limit
const limit = rateLimit({
  max: Number(RATE_LIMIT_MAX),
  windowMs: Number(RATE_LIMIT_WINDOW),
  message: 'Too many requests. Please try again later',
});

// Rate limit for auth routes
const authLimit = rateLimit({
  max: Number(AUTH_RATE_LIMIT_MAX),
  windowMs: Number(AUTH_RATE_LIMIT_WINDOW),
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
if (NODE_ENV === 'development') app.use(morgan('dev'));

const API_PREFIX = '/api/v1/';

// Routes
app.use(`${API_PREFIX}movies`, limit, movieRouter);
app.use(`${API_PREFIX}auth`, authLimit, authRouter);
app.use(`${API_PREFIX}users`, limit, userRouter);
app.use(`${API_PREFIX}cinemas`, limit, cinemaRouter);
app.use(`${API_PREFIX}halls`, limit, hallRouter);
app.use(`${API_PREFIX}rows`, limit, rowRouter);
app.use(`${API_PREFIX}seats`, limit, seatRouter);
app.use(`${API_PREFIX}showtimes`, limit, showtimeRouter);
app.use(`${API_PREFIX}reservations`, limit, reservationRouter);
app.use(`${API_PREFIX}reviews`, limit, reviewRouter);

// Handle unhandled routes
app.use((req, res, next) =>
  next(new AppError('The requested resource was not found', 404)),
);

app.use(globalErrorHandler);
