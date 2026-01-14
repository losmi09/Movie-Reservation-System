import { PrismaClient } from '@prisma/client';
import { createClient } from 'redis';
import app from './app.js';

const logError = (err, type) => {
  const error =
    type === 'exception' ? 'UNCAUGHT EXCEPTION' : 'UNHANDLED REJECTION';
  console.error(`${error}! 💥 Shutting down...`);
  console.error(`${err.name}: ${err.message}`);
};

const port = process.env.PORT ?? 8000;

const server = app.listen(port, () => `Server running on port ${port}...`);

process.on('uncaughtException', err => {
  logError(err, 'exception');
  server.close(() => process.exit(1));
});

const prisma = new PrismaClient();

const createRedisClient = async () => {
  const redisClient = createClient();

  redisClient.on('error', err => console.error('Redis Client Error:', err));

  await redisClient.connect();

  return redisClient;
};

export const redisClient = await createRedisClient();

process.on('unhandledRejection', err => {
  logError(err, 'rejection');
  server.close(() => process.exit(1));
});

export default prisma;
