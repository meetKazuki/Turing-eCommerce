import { Router } from 'express';
import welcomeRoute from './welcome.route';

const routes = Router();

routes.use('/', welcomeRoute);

export default routes;
