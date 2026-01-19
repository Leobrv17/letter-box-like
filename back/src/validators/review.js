import { body } from 'express-validator';

export const reviewValidation = [
  body('imdbId').trim().notEmpty().withMessage('imdbId required'),
  body('titleSnapshot').trim().notEmpty().withMessage('title required'),
  body('text').trim().isLength({ min: 3 }).withMessage('Review text required'),
  body('rating').optional().isFloat({ min: 0, max: 10 }).withMessage('Rating 0-10'),
  body('visibility')
    .optional()
    .isIn(['public', 'unlisted', 'private'])
    .withMessage('Visibility invalid')
];
