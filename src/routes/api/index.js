import { Router } from 'express';
import customerRoute from './customer.route';
import productRoute from './product.route';
import taxRoute from './tax.route';
import welcomeRoute from './welcome.route';

const routes = Router();

routes.use('/', customerRoute);
routes.use('/', productRoute);
routes.use('/', taxRoute);
routes.use('/', welcomeRoute);

export default routes;
