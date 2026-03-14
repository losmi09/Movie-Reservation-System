import crypto from 'crypto';
import { catchAsync } from '../utils/catchAsync.js';
import { sendResponse } from '../controllers/utils/sendResponse.js';
import { redisClient } from '../server.js';

const getCacheKey = originalUrl => {
  // Check if originalUrl includes query string
  if (!originalUrl.includes('?')) return originalUrl;

  // Extract query params
  const params = new URLSearchParams(originalUrl.split('?')[1]);

  // Sort parameters alphabetically by their keys to avoid different hashes due to order
  params.sort();

  return params.toString();
};

export const cacheAll = model =>
  catchAsync(async (req, res, next) => {
    const cacheKey = getCacheKey(req.originalUrl);

    // Produce a fixed-length hash of params for efficient memory usage and easier comparison
    const parametersHash = crypto
      .createHash('MD5')
      .update(cacheKey)
      .digest('hex');

    const keyString = `${model}:list:${parametersHash}`;

    const cachedDocs = await redisClient.get(keyString);

    if (cachedDocs) return res.status(200).json(JSON.parse(cachedDocs));

    req.cacheKey = keyString;

    next();
  });

export const cacheOne = model =>
  catchAsync(async (req, res, next) => {
    const cacheKey = `${model}:${req.params.id}`;

    const cachedDoc = await redisClient.get(cacheKey);

    if (cachedDoc) return sendResponse(res, JSON.parse(cachedDoc));

    req.cacheKey = cacheKey;

    next();
  });
