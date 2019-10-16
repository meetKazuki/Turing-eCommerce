import { check } from 'express-validator';
import capitalize from '../helpers/capitalize';

export default {
  customerUpdateSchema: [
    check('name')
      .optional()
      .trim()
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('Name cannot be blank')
      .isLength({ min: 2 })
      .withMessage('Name should be between 2 to 15 characters')
      .matches(/^[A-Za-z ]+$/)
      .withMessage('name must contain only letters and spaces')
      .customSanitizer(value => capitalize(value)),

    check('email')
      .optional()
      .trim()
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('Email cannot be blank')
      .isEmail()
      .withMessage('Email is not valid')
      .customSanitizer(email => email.toLowerCase()),

    check('day_phone')
      .optional()
      .trim()
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('Number cannot be blank'),

    check('eve_phone')
      .optional()
      .trim()
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('Number cannot be blank'),

    check('mob_phone')
      .optional()
      .trim()
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('Number cannot be blank')
  ],
};
