import { Router } from 'express';
import customerRoute from './customer.route';
import welcomeRoute from './welcome.route';

const routes = Router();

routes.use('/', customerRoute);
routes.use('/', welcomeRoute);

export default routes;
