/**
 * Standardized API Response Helper
 * All API endpoints should use these methods for consistency
 */

export class ApiResponse {
  /**
   * Send successful response
   * @param {Object} res - Express response object
   * @param {*} data - Response data
   * @param {string} message - Success message
   * @param {number} statusCode - HTTP status code (default: 200)
   */
  static success(res, data, message = "Success", statusCode = 200) {
    res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Send created response (201)
   * @param {Object} res - Express response object
   * @param {*} data - Response data
   * @param {string} message - Success message
   */
  static created(res, data, message = "Created successfully") {
    res.status(201).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Send error response
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code (default: 400)
   * @param {*} details - Additional error details
   */
  static error(res, message, statusCode = 400, details = null) {
    res.status(statusCode).json({
      success: false,
      message,
      ...(details && { details }),
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Send validation error
   * @param {Object} res - Express response object
   * @param {string} message - Validation error message
   * @param {*} details - Validation details
   */
  static validation(res, message, details = null) {
    res.status(400).json({
      success: false,
      message: message || "Validation failed",
      errors: details,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Send unauthorized error
   * @param {Object} res - Express response object
   * @param {string} message - Unauthorized message
   */
  static unauthorized(res, message = "Unauthorized") {
    res.status(401).json({
      success: false,
      message,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Send forbidden error
   * @param {Object} res - Express response object
   * @param {string} message - Forbidden message
   */
  static forbidden(res, message = "Forbidden") {
    res.status(403).json({
      success: false,
      message,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Send not found error
   * @param {Object} res - Express response object
   * @param {string} message - Not found message
   */
  static notFound(res, message = "Not found") {
    res.status(404).json({
      success: false,
      message,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Send conflict error (already exists)
   * @param {Object} res - Express response object
   * @param {string} message - Conflict message
   */
  static conflict(res, message = "Already exists") {
    res.status(409).json({
      success: false,
      message,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Send server error
   * @param {Object} res - Express response object
   * @param {string} message - Server error message
   * @param {*} details - Error details (only in development)
   */
  static serverError(res, message = "Internal server error", details = null) {
    res.status(500).json({
      success: false,
      message,
      ...(process.env.NODE_ENV === "development" && details && { details }),
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Validation helper for request bodies
 * @param {Object} schema - Joi validation schema
 * @param {Object} data - Data to validate
 * @returns {Object} - { error, value }
 */
export function validateRequest(schema, data) {
  return schema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });
}
