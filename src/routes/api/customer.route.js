import { Router } from 'express';
import CustomerController from '../../controllers/customer.controller';

const router = Router();

router.post(
  '/customers/signup',
  CustomerController.create
);

export default router;
