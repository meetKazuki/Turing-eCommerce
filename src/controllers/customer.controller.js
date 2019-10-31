import { Customer } from '../database/models';
import generateToken from '../helpers/auth';
import isEmptyObject from '../helpers/isEmptyObject';
import response from '../helpers/response';

/**
 * @class CustomerController
 * @description handles all requests that has to do with customer
 */
class CustomerController {
  /**
   * @description create a customer record
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

      response.setSuccess(
        201,
        'sign-up successfully',
        { newCustomer, token }
      );
      return response.send(res);
    } catch (error) {
      response.setError(500, 'server error');
      return response.send(res);
    }
  }

  /**
   * @description log in a customer
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
      response.setError(401, 'email or password is incorrect');
      return response.send(res);
    }
    const isPassword = await user.validatePassword(password);
    if (!isPassword) {
      response.setError(401, 'email or password is incorrect');
      return response.send(res);
    }

    const token = `Bearer ${generateToken(user)}`;
    const customer = await user.getSafeDataValues();
    response.setSuccess(
      200,
      'user log-in successful',
      { customer, token }
    );
    return response.send(res);
  }

  /**
   * @description get customer profile data
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
      response.setSuccess(
        200,
        'retrieval successful',
        customer
      );
      return response.send(res);
    } catch (error) {
      response.setError(500, 'server error');
      return response.send(res);
    }
  }

  /**
   * @description update customer profile data
   * such as name, email, password, day_phone, eve_phone and mob_phone
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @returns {json} json object with status customer profile data
   * @memberof CustomerController
   */
  static async updateCustomer(req, res) {
    const { customer_id } = req.user; //eslint-disable-line
    const payload = req.body;
    const type = req.url.split('/')[2];
    let user;
    let updatedCustomer;

    try {
      if (isEmptyObject(payload)) {
        response.setError(400, 'request body cannot be empty');
        return response.send(res);
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
      response.setSuccess(
        200,
        'update successful',
        updatedCustomer.getSafeDataValues()
      );
      return response.send(res);
    } catch (error) {
      response.setError(500, 'server error');
      return response.send(res);
    }
  }
}

export default CustomerController;
