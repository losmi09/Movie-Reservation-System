export const sendResponse = (res, data, statusCode = 200) => {
  // Send no content
  if (statusCode === 204) return res.status(204).end();

  res.status(statusCode).json({ data });
};
