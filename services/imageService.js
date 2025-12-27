import sharp from 'sharp';

export const resizeImage = async (buffer, fileName) =>
  await sharp(buffer)
    .resize(500, 500)
    .toFormat('jpg')
    .jpeg({ quality: 90 })
    .toFile(`public/images/users/${fileName}`);
