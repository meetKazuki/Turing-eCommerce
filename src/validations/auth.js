import { check } from 'express-validator';
import capitalize from '../helpers/capitalize';

export default {
  signupSchema: [
    check('name')
      .exists().withMessage('Name is required')
      .trim()
      .isLength({ min: 2 })
      .withMessage('Name should not be less than 2 characters')
      .customSanitizer(value => capitalize(value)),

    check('email')
      .isEmail()
      .withMessage('Enter a valid email address')
      .customSanitizer(email => email.toLowerCase()),

    check('password')
      .trim()
      .exists().withMessage('Password is required')
      .isLength({ min: 8, max: 15 })
      .withMessage('Password should be between 8 to 15 characters')
      .isAlphanumeric()
      .withMessage('Password must be alphanumeric')
  ]
};
