import { Department } from '../database/models';
import response from '../helpers/response';

/**
 * @class CustomerController
 */
class ProductController {
/**
   * get all departments
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

  /**
   * Get a single department
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns {json} json object with status and department list
   */
  static async getDepartment(req, res) {
    const { department_id } = req.params; // eslint-disable-line
    try {
      const department = await Department.findByPk(department_id);
      if (!department) {
        // eslint-disable-next-line camelcase
        response.setError(404, `Department with id ${department_id} does not exist`);
        return response.send(res);
      }
      response.setSuccess(200, 'retrieval successful', department);
      return response.send(res);
    } catch (error) {
      response.setError(500, 'server error');
      return response.send(res);
    }
  }
}

export default ProductController;
