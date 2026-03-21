import slugify from 'slugify';

export const generateSlugObject = text => ({
  slug: slugify(text, { lower: true }),
});
