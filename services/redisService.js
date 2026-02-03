import { redisClient } from '../server.js';

export const setRefreshToken = async (userId, refreshToken) =>
  await redisClient.set(`refreshToken:user:${userId}`, refreshToken, {
    EX: process.env.REFRESH_TOKEN_EXPIRES_IN,
  });

export const getRefreshToken = async userId =>
  await redisClient.get(`refreshToken:user:${userId}`);

export const revokeRefreshToken = async userId =>
  await redisClient.del(`refreshToken:user:${userId}`);

export const invalidateCache = async model => {
  // Find all keys that start with the model name (e.g. movie:12, movie:list:<hash>)
  const keys = await redisClient.keys(`${model}:*`);

  if (keys.length) await redisClient.del(keys);
};
