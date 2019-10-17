import { check } from 'express-validator';
import capitalize from '../helpers/capitalize';

export default {
  profileUpdateSchema: [
    check('name')
      .optional()
      .trim()
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('name cannot be blank')
      .isLength({ min: 2 })
      .withMessage('name should be between 2 to 15 characters')
      .matches(/^[A-Za-z ]+$/)
      .withMessage('name must contain only letters and spaces')
      .customSanitizer(value => capitalize(value)),

    check('email')
      .optional()
      .trim()
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('email cannot be blank')
      .isEmail()
      .withMessage('email is not valid')
      .customSanitizer(email => email.toLowerCase()),

    check('day_phone')
      .optional()
      .trim()
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('day_phone field cannot be blank'),

    check('eve_phone')
      .optional()
      .trim()
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('eve_phone field cannot be blank'),

    check('mob_phone')
      .optional()
      .trim()
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('mob_phone field cannot be blank')
  ],

  addressUpdateSchema: [
    check('address_1')
      .exists()
      .withMessage('address_1 field is required')
      .trim()
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('address_1 field must not be empty')
      .isLength({ min: 10 })
      .withMessage('address_1 must be more than 10 characters')
      .customSanitizer(value => capitalize(value)),

    check('address_2')
      .optional()
      .trim()
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('address_2 field must not be empty')
      .isLength({ min: 10 })
      .withMessage('address_2 must be more than 10 characters')
      .customSanitizer(value => capitalize(value)),

    check('city')
      .exists()
      .withMessage('city field is required')
      .trim()
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('city field must not be empty')
      .customSanitizer(value => capitalize(value)),

    check('region')
      .exists()
      .withMessage('region field is required')
      .trim()
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('region field must not be empty')
      .customSanitizer(value => capitalize(value)),

    check('postal_code')
      .exists()
      .withMessage('postal_code field is required')
      .trim()
      .not()
      .isEmpty()
      .withMessage('postal_code field must not be empty')
      .isLength({ min: 3 })
      .withMessage('postal_code must be more than 3 characters'),

    check('shipping_region_id')
      .exists()
      .withMessage('shipping_region_id field is required')
      .trim()
      .not()
      .isEmpty()
      .withMessage('shipping_region_id field must not be empty')
      .isIn([2, 3, 4])
      .withMessage(
        'valid shipping_region_id values are "2 - US/Canada, 3 - Europe, 4 - Rest of the world"',
      ),
  ],

  cardUpdateSchema: [
    check('credit_card')
      .exists()
      .withMessage('credit_card field is required')
      .trim()
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('credit_card field cannot be empty')
      .isLength({ min: 12, max: 19 })
      .withMessage('credit_card must be between 12 to 19 digits')
  ]
};
