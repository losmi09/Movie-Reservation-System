import sharp from 'sharp';

export const resizeImage = (folder, buffer, fileName) =>
  sharp(buffer)
    .resize(500, 500)
    .toFormat('jpg')
    .jpeg({ quality: 90 })
    .toFile(`public/images/${folder}/${fileName}`);
