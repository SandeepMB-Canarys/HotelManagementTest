const { validationResult } = require('express-validator');

class BaseController {
  /**
   * Check for validation errors
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns {boolean} true if there are validation errors
   */
  checkValidationErrors(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return true;
    }
    return false;
  }

  /**
   * Send success response
   * @param {import('express').Response} res
   * @param {any} data
   * @param {number} statusCode
   */
  sendSuccess(res, data, statusCode = 200) {
    res.status(statusCode).json({
      success: true,
      data
    });
  }

  /**
   * Send error response
   * @param {import('express').Response} res
   * @param {string} message
   * @param {Error} error
   * @param {number} statusCode
   */
  sendError(res, message, error, statusCode = 500) {
    res.status(statusCode).json({
      success: false,
      message,
      error: error.message
    });
  }

  /**
   * Handle common errors
   * @param {import('express').Response} res
   * @param {Error} error
   * @param {Object} errorMap - Map of error messages to status codes
   * @param {string} defaultMessage
   */
  handleError(res, error, errorMap, defaultMessage) {
    const statusCode = errorMap[error.message];
    if (statusCode) {
      return this.sendError(res, error.message, error, statusCode);
    }
    this.sendError(res, defaultMessage, error);
  }
}

module.exports = BaseController;
