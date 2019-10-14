import { config } from 'dotenv';
import jwt from 'jsonwebtoken';

config();
const secret = process.env.JWT_KEY;

// eslint-disable-next-line camelcase
const generateToken = ({ customer_id, email }) => {
  const token = jwt.sign({ customer_id, email }, secret, { expiresIn: '24h' });
  return token;
};

export default generateToken;
