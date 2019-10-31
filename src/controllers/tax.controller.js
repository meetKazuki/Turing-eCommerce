import response from '../helpers/response';
import { Tax } from '../database/models';

/**
 * @class TaxController
 * @description contains methods which are needed for all tax request
 */
class TaxController {
  /**
   * @description This method get all taxes
   * @param {null} _
   * @param {object} res
   * @returns {json} tax response
   */
  static async getAllTax(_, res) {
    const tax = await Tax.findAll();
    response.setSuccess(200, 'retrieval successful', tax);
    return response.send(res);
  }
}

export default TaxController;
