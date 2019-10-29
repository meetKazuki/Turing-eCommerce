import { config } from 'dotenv';
import jwt from 'jsonwebtoken';
import { Customer } from '../database/models';
import response from '../helpers/response';

config();

const { JWT_KEY } = process.env;

export default {
  verifyToken: (req, res, next) => {
    const authHeader = req.headers['user-key'];
    if (!authHeader) {
      response.setError(412, 'authorization header not set');
      return response.send(res);
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_KEY, async (error, decodedToken) => {
      if (error) {
        response.setError(401, `${error.message}`);
        return response.send(res);
      }

      const { customer_id: userId } = decodedToken;
      const user = await Customer.findByPk(userId);
      if (!user) {
        response.setError(403, 'invalid credentials');
        return response.send(res);
      }

      req.user = user;
      return next();
    });
  },

  checkExistingUser: async (req, res, next) => {
    const { email } = req.body;
    const user = await Customer.findOne({ where: { email } });
    if (user) {
      response.setError(409, 'user already exist');
      return response.send(res);
    }
    return next();
  },
};
