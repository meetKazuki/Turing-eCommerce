import { Router } from 'express';
import ProductController from '../../controllers/product.controller';

const router = Router();

router.get(
  '/departments',
  ProductController.getAllDepartments
);

router.get(
  '/departments/:department_id',
  ProductController.getDepartment
);


export default router;
