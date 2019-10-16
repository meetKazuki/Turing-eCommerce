import { Customer } from '../database/models';
import generateToken from '../helpers/auth';
import isEmptyObject from '../helpers/isEmptyObject';
import Response from '../helpers/response';

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
        'Sign-up successfully',
        { newCustomer, token }
      );
      return Response.send(res);
    } catch (error) {
      Response.setError(500, error.message);
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
      Response.setError(401, 'Email or Password is incorrect');
      return Response.send(res);
    }
    const isPassword = await user.validatePassword(password);
    if (!isPassword) {
      Response.setError(401, 'Email or Password is incorrect');
      return Response.send(res);
    }

    const token = `Bearer ${generateToken(user)}`;
    const customer = await user.getSafeDataValues();
    Response.setSuccess(
      200,
      'User log-in successful',
      { customer, token }
    );
    return Response.send(res);
  }

  /**
   * get customer profile data
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
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
        'Customer details retrieved successfully',
        customer
      );
      return Response.send(res);
    } catch (error) {
      Response.setError(500, error.message);
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
  static async updateCustomerProfile(req, res) {
    const { customer_id } = req.user;  // eslint-disable-line
    const payload = req.body;

    if (isEmptyObject(payload)) {
      Response.setError(400, 'Request body cannot be empty');
      return Response.send(res);
    }

    const user = await Customer.findByPk(customer_id);
    const updatedCustomer = await user.update(
      { ...payload },
      { where: { customer_id }, returning: true }
    );

    Response.setSuccess(
      200,
      'Customer details updated successfully',
      updatedCustomer
    );
    return Response.send(res);
  }
}

export default CustomerController;
