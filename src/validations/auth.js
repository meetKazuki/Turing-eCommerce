import { check } from 'express-validator';
import capitalize from '../helpers/capitalize';

export default {
  signupSchema: [
    check('name')
      .exists()
      .withMessage('name is required')
      .trim()
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('name cannot be blank')
      .isLength({ min: 2 })
      .withMessage('name should not be less than 2 characters')
      .matches(/^[A-Za-z ]+$/)
      .withMessage('name must contain only letters and spaces')
      .customSanitizer(value => capitalize(value)),

    check('email')
      .exists()
      .withMessage('email address is required')
      .trim()
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('email cannot be blank')
      .isEmail()
      .withMessage('enter a valid email address')
      .customSanitizer(email => email.toLowerCase()),

    check('password')
      .exists()
      .withMessage('password is required')
      .trim()
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('password cannot be blank')
      .isLength({ min: 8, max: 15 })
      .withMessage('password should be between 8 to 15 characters')
      .isAlphanumeric()
      .withMessage('password must be alphanumeric')
  ],

  signinSchema: [
    check('email')
      .exists()
      .withMessage('email address is required')
      .trim()
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('email cannot be blank')
      .isEmail()
      .withMessage('enter a valid email address')
      .customSanitizer(value => value.toLowerCase()),

    check('password')
      .exists()
      .withMessage('password is required')
      .trim()
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('password cannot be blank')
      .isLength({ min: 8, max: 15 })
      .withMessage('password should be between 8 to 15 characters')
  ]
};
