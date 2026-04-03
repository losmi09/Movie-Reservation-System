import { AppError } from '../utils/appError.js';

export const decodeCursorToken = cursorToken => {
  try {
    const { createdAt: cursorCreatedAt, id: cursorId } = JSON.parse(
      Buffer.from(cursorToken, 'base64').toString('utf8'),
    );

    return { cursorCreatedAt, cursorId };
  } catch {
    throw new AppError('Invalid cursor', 400);
  }
};

export const encodeCursorToken = (createdAt, id) =>
  Buffer.from(JSON.stringify({ createdAt, id })).toString('base64');
