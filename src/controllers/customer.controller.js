import { Customer } from '../database/models';
import { generateToken } from '../helpers/auth';

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
      const token = generateToken({ newCustomer });

      return res.status(201).json({
        customer: customerDetails,
        accessToken: token,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'this sucks',
        error: error.message
      });
    }
  }
}

export default CustomerController;
