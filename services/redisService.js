import { redisClient } from '../server.js';

export const setRefreshToken = (userId, refreshToken) =>
  redisClient.set(`refreshToken:user:${userId}`, refreshToken, {
    EX: process.env.REFRESH_TOKEN_EXPIRES_IN,
  });

export const getRefreshToken = userId =>
  redisClient.get(`refreshToken:user:${userId}`);

export const revokeRefreshToken = userId =>
  redisClient.del(`refreshToken:user:${userId}`);

export const invalidateCache = async model => {
  // Find all keys that start with the model name (e.g. movie:12, movie:list:<hash>)
  const keys = await redisClient.keys(`${model}:*`);

  if (keys.length) await redisClient.del(keys);
};

const getUserJtiSetKey = userId => `user:${userId}:jtis`;

export const revokeUserJti = (userId, jti) =>
  redisClient.sRem(getUserJtiSetKey(userId), jti);

export const revokeAllUserJtis = userId =>
  redisClient.del(getUserJtiSetKey(userId));

export const addUserJti = (userId, jti, expiration) => {
  const userJtisKey = getUserJtiSetKey(userId);

  return redisClient
    .multi()
    .sAdd(userJtisKey, jti)
    .expire(userJtisKey, expiration)
    .exec();
};

export const isJtiValid = (userId, jti) =>
  redisClient.sIsMember(getUserJtiSetKey(userId), jti);
