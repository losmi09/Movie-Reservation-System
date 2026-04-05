const logError = (err, message) => {
  console.error(`${message}! 💥 Shutting down...`);
  console.error(`${err.name}: ${err.message}`);
};

const ERROR_EXIT_CODE = 1;

process.on('uncaughtException', err => {
  logError(err, 'UNCAUGHT EXCEPTION');
  process.exit(ERROR_EXIT_CODE);
});

import { PrismaClient } from '@prisma/client';
import { createClient } from 'redis';
import { app } from './app.js';

const port = process.env.PORT ?? 8000;

const server = app.listen(port, () =>
  console.log(`Server running on port ${port}...`),
);

export const prisma = new PrismaClient();

const createRedisClient = async () => {
  const redisClient = createClient();

  redisClient.on('error', err => console.error('Redis Client Error:', err));

  await redisClient.connect();

  return redisClient;
};

export const redisClient = await createRedisClient();

const shutDownServer = async () => {
  await prisma.$disconnect();
  await redisClient.quit();
  server.close(() => process.exit(ERROR_EXIT_CODE));
};

process.on('unhandledRejection', err => {
  logError(err, 'UNHANDLED REJECTION');
  shutDownServer();
});
