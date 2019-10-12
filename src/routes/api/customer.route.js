import { Router } from 'express';
import authentication from '../../middleware/auth';
import CustomerController from '../../controllers/customer.controller';
import schemas from '../../validations/auth';
import validator from '../../middleware/validator';

const router = Router();
const { checkExistingUser } = authentication;
const { signupSchema, signinSchema } = schemas;

router.post(
  '/customers',
  validator(signupSchema),
  checkExistingUser,
  CustomerController.create
);

router.post(
  '/customers/login',
  validator(signinSchema),
  CustomerController.login
);

export default router;
