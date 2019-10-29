import { Router } from 'express';
import ProductController from '../../controllers/product.controller';

const router = Router();

router.get(
  '/departments',
  ProductController.getAllDepartments
);

export default router;
