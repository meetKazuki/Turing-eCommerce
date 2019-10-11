import { config } from 'dotenv';
import jwt from 'jsonwebtoken';
import { Customer } from '../database/models';
import Response from '../helpers/response';

config();

const { JWT_KEY } = process.env;

export default {
  verifyToken: (req, res, next) => {
    const token = req.headers.authorization;
    try {
      if (!token) {
        Response.setError(401, 'Unauthorized. Provide a token to continue');
        return Response.send(res);
      }
      const payload = jwt.verify(token, JWT_KEY);
      req.user = payload;
      return next();
    } catch (error) {
      Response.setError(401, 'Unauthorized. Token is invalid or expired');
      return Response.send(res);
    }
  },

  checkExistingUser: async (req, res, next) => {
    const { email } = req.body;
    const theUser = await Customer.findOne({ where: { email } });
    if (theUser) {
      Response.setError(409, 'User already exist');
      return Response.send(res);
    }

    return next();
  },
};
