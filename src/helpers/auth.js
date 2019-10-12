import { config } from 'dotenv';
import jwt from 'jsonwebtoken';

config();
const secret = process.env.JWT_KEY;

export const generateToken = (payload) => {
  const token = jwt.sign(payload, secret, { expiresIn: '24h' });
  return token;
};

export default { generateToken };
