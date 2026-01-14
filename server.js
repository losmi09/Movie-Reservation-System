import { PrismaClient } from '@prisma/client';
import { createClient } from 'redis';
import app from './app.js';

process.on('uncaughtException', err => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(`${err.name}: ${err.message}`);
  process.exit(1);
});

const prisma = new PrismaClient();

const createRedisClient = async () => {
  const redisClient = createClient();

  redisClient.on('error', err => console.error('Redis Client Error:', err));

  return await redisClient.connect();
};

export const redisClient = await createRedisClient();

const port = process.env.PORT ?? 8000;

app.listen(port, () => `Server running on port ${port}...`);

export default prisma;
