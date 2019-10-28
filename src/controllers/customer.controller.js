import { Customer } from '../database/models';
import generateToken from '../helpers/auth';
import isEmptyObject from '../helpers/isEmptyObject';
import Response from '../helpers/response';
import { createOrFindUser, facebookAuth } from '../services/auth';

/**
 * @class CustomerController
 */
class CustomerController {
  /**
   * create a customer record
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @returns {json} json object with status, customer data and access token
   * @memberof CustomerController
   */
  static async create(req, res) {
    try {
      const customer = await Customer.create(req.body);
      const newCustomer = await customer.getSafeDataValues();
      const token = `Bearer ${generateToken(newCustomer)}`;

      Response.setSuccess(
        201,
        'sign-up successfully',
        { newCustomer, token }
      );
      return Response.send(res);
    } catch (error) {
      Response.setError(500, 'server error');
      return Response.send(res);
    }
  }

  /**
   * log in a customer
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @returns {json} json object with status, and access token
   * @memberof CustomerController
   */
  static async login(req, res) {
    const { email, password } = req.body;

    const user = await Customer.findOne({ where: { email } });
    if (!user) {
      Response.setError(401, 'email or password is incorrect');
      return Response.send(res);
    }
    const isPassword = await user.validatePassword(password);
    if (!isPassword) {
      Response.setError(401, 'email or password is incorrect');
      return Response.send(res);
    }

    const token = `Bearer ${generateToken(user)}`;
    const customer = await user.getSafeDataValues();
    Response.setSuccess(
      200,
      'user log-in successful',
      { customer, token }
    );
    return Response.send(res);
  }

  /**
   * Handles user sign up and sign in using their social media accounts
   *
   * - Facebook login
   * - Google login
   *
   * @function
   *
   * @param {object} req - the request object to the server
   * @param {object} res - express response object
   * @returns {json} - response object
   */
  static async socialLogin(req, res) {
    const { provider } = req.params;
    const providerHandle = {
      facebook: facebookAuth,
      // google: googleAuth
    };
    const userDetails = await providerHandle[provider](req.body);
    const { status, data } = await createOrFindUser(userDetails);

    return res.status(status).json({ status: 'success', data });
  }

  /**
   * get customer profile data
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @returns {json} json object with status customer profile data
   * @memberof CustomerController
   */
  static async getCustomerProfile(req, res) {
    const { customer_id } = req.user;  // eslint-disable-line
    try {
      const user = await Customer.findByPk(customer_id);
      const customer = await user.getSafeDataValues();
      Response.setSuccess(
        200,
        'customer details retrieved successfully',
        customer
      );
      return Response.send(res);
    } catch (error) {
      Response.setError(500, 'server error');
      return Response.send(res);
    }
  }

  /**
   * update customer profile data
   * such as name, email, password, day_phone, eve_phone and mob_phone
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @returns {json} json object with status customer profile data
   * @memberof CustomerController
   */
  static async updateCustomer(req, res) {
    const { customer_id } = req.user; //eslint-disable-line
    const type = req.url.split('/')[2];
    const payload = req.body;
    let user;
    let updatedCustomer;

    try {
      if (isEmptyObject(payload)) {
        Response.setError(400, 'request body cannot be empty');
        return Response.send(res);
      }
      switch (type) {
        case 'creditCard':
        case 'address':
        default:
          user = await Customer.findByPk(customer_id);
          updatedCustomer = await user.update(
            { ...payload },
            { where: { customer_id }, returning: true }
          );
          break;
      }
      Response.setSuccess(
        200,
        'update successful',
        updatedCustomer.getSafeDataValues()
      );
      return Response.send(res);
    } catch (error) {
      Response.setError(500, 'server error');
      return Response.send(res);
    }
  }
}

export default CustomerController;
