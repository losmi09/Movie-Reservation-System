import { PrismaClient } from '@prisma/client';
import { createClient } from 'redis';
import app from './app.js';

const prisma = new PrismaClient();

const cachingClient = async () => {
  try {
    return await createClient().connect();
  } catch (err) {
    console.error('Redis Client Error: ', err.message);
  }
};

export const redisClient = await cachingClient();

const port = process.env.PORT ?? 8000;

app.listen(port, () => `Server running on port ${port}...`);

export default prisma;
