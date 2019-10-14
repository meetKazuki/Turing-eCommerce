import { Customer } from '../database/models';
import generateToken from '../helpers/auth';

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
      const newCustomer = await Customer.create(req.body);
      const customerDetails = await newCustomer.getSafeDataValues();
      const token = generateToken(newCustomer);

      return res.status(201).json({
        customer: customerDetails,
        accessToken: token,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
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
      return res.status(401).json({
        error: 'The email doesn\'t exist'
      });
    }
    const isPassword = await user.validatePassword(password);
    if (!isPassword) {
      return res.status(401).json({ error: 'Email or Password is invalid' });
    }

    const token = generateToken(user);
    const customerDetails = await user.getSafeDataValues();

    return res.status(200).json({
      customer: customerDetails,
      accessToken: token,
    });
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
  static async getCustomerProfile(req, res, next) {
    const { customer_id } = req.user;  // eslint-disable-line
    try {
      const customer = await Customer.findByPk(customer_id);
      const customerDetails = await customer.getSafeDataValues();
      return res.status(200).json({
        customerDetails,
      });
    } catch (error) {
      return next(error);
    }
  }
}

export default CustomerController;
