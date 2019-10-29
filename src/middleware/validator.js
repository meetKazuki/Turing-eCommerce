import { matchedData, validationResult } from 'express-validator';
import response from '../helpers/response';

export default (schemas) => {
  const validatorCheck = (req, res, next) => {
    const errors = validationResult(req);
    req = { ...req, ...matchedData(req) };

    if (!errors.isEmpty()) {
      const mapErrors = Object
        .entries(errors.mapped())
        .reduce(
          (accumulator, [key, value]) => {
            accumulator[key] = value.msg;
            return accumulator;
          }, {}
        );
      response.setError(400, mapErrors);
      return response.send(res);
    }
    return next();
  };
  return [...(schemas.length && [schemas]), validatorCheck];
};
