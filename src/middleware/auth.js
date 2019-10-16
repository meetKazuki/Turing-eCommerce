import { config } from 'dotenv';
import jwt from 'jsonwebtoken';
import { Customer } from '../database/models';
import Response from '../helpers/response';

config();

const { JWT_KEY } = process.env;

export default {
  verifyToken: (req, res, next) => {
    const authHeader = req.headers['user-key'];
    if (!authHeader) {
      Response.setError(412, 'Authorization header not set');
      return Response.send(res);
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_KEY, async (error, decodedToken) => {
      if (error) {
        Response.setError(401, `${error.message}`);
        return Response.send(res);
      }

      const { customer_id: userId } = decodedToken;
      const user = await Customer.findByPk(userId);
      if (!user) {
        Response.setError(403, 'Invalid credentials');
        return Response.send(res);
      }

      req.user = user;
      return next();
    });
  },

  checkExistingUser: async (req, res, next) => {
    const { email } = req.body;
    const user = await Customer.findOne({ where: { email } });
    if (user) {
      Response.setError(409, 'User already exist');
      return Response.send(res);
    }
    return next();
  },
};
