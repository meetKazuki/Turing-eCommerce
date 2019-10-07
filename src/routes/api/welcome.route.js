import { Router } from 'express';

const welcomeRoute = Router();

welcomeRoute.get('/', (req, res) => res.status(200).json({
  success: true,
  message: 'Welcome to Turing e-Commerce shop API',
}));

export default welcomeRoute;
