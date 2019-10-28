import { Router } from 'express';
import authentication from '../../middleware/auth';
import CustomerController from '../../controllers/customer.controller';
import authSchemas from '../../validations/auth';
import customerSchemas from '../../validations/customer';
import validator from '../../middleware/validator';

const router = Router();
const { checkExistingUser, verifyToken } = authentication;
const { signupSchema, signinSchema } = authSchemas;
const {
  profileUpdateSchema, addressUpdateSchema, cardUpdateSchema
} = customerSchemas;

router.post(
  '/customers',
  validator(signupSchema),
  checkExistingUser,
  CustomerController.create
);

router.post(
  'customers/:provider',
  CustomerController.socialLogin
);

router.post(
  '/customers/login',
  validator(signinSchema),
  CustomerController.login
);

router.get(
  '/customers',
  verifyToken,
  CustomerController.getCustomerProfile
);

router.put(
  '/customer',
  verifyToken,
  validator(profileUpdateSchema),
  CustomerController.updateCustomer
);

router.put(
  '/customer/address',
  verifyToken,
  validator(addressUpdateSchema),
  CustomerController.updateCustomer
);

router.put(
  '/customer/creditCard',
  verifyToken,
  validator(cardUpdateSchema),
  CustomerController.updateCustomer
);

export default router;
