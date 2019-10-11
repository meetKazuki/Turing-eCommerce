import { Router } from 'express';
import authentication from '../../middleware/auth';
import CustomerController from '../../controllers/customer.controller';
import schemas from '../../validations/auth';
import validator from '../../middleware/validator';

const router = Router();
const { checkExistingUser } = authentication;
const { signupSchema } = schemas;

router.post(
  '/customers/signup',
  validator(signupSchema),
  checkExistingUser,
  CustomerController.create
);

export default router;
