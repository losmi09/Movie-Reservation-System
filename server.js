const logError = (err, message) => {
  console.error(`${message}! 💥 Shutting down...`);
  console.error(`${err.name}: ${err.message}`);
};

process.on('uncaughtException', err => {
  logError(err, 'UNCAUGHT EXCEPTION');
  process.exit(1);
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
  server.close(() => process.exit(1));
};

process.on('unhandledRejection', err => {
  logError(err, 'UNHANDLED REJECTION');
  shutDownServer();
});
