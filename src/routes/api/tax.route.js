import { Router } from 'express';
import TaxController from '../../controllers/tax.controller';

const router = Router();

router.get(
  '/tax',
  TaxController.getAllTax
);

export default router;
