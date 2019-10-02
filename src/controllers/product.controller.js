import { Department } from '../database/models';
import response from '../helpers/response';

/**
 * @class CustomerController
 */
class ProductController {
/**
   * get all departments
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @returns {json} json object with status and department list
   * @memberof ProductController
   */
  static async getAllDepartments(req, res) {
    try {
      const departments = await Department.findAll();
      response.setSuccess(200, 'retrieval successful', departments);
      return response.send(res);
    } catch (error) {
      response.setError(500, 'server error');
      return response.send(res);
    }
  }
}

export default ProductController;
