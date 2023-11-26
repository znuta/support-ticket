/**
 * NotAuthorizeError is a custom error class that extends the CustomResponse class.
 * It represents an error indicating that the user is not authorized to access a resource.
 * The class sets the default HTTP status code to 400 (Bad Request).
 *
 * @class NotAuthorizeError
 * @extends CustomResponse
 * @exports NotAuthorizeError - Custom error class for unauthorized access
 * @constructor
 * @param {string} [reasons] - Optional custom reasons for the unauthorized access error.
 * @param {number} [statusCode] - Optional custom HTTP status code for the error.
 * @author Toyeeb Atunde
 */
import { CustomResponse, ErrorObject } from "./customResponse";

export class NotAuthorizeError extends CustomResponse {
  /**
   * statusCode represents the HTTP status code for a NotAuthorizeError (400).
   * @type {number}
   */
  statusCode = 400;

  /**
   * reasons represent custom reasons for the unauthorized access error.
   * @type {string}
   */
  reasons = "Please login or register to continue";

  /**
   * success represents the HTTP status type boolean.
   * @type {boolean}
   */
  success = false;

  /**
   * Constructor for the NotAuthorizeError class.
   * @constructor
   * @param {string} [reasons] - Optional custom reasons for the unauthorized access error.
   * @param {number} [statusCode] - Optional custom HTTP status code for the error.
   */
  constructor(reasons?: string, statusCode?: number) {
    // Call the constructor of the base class (CustomResponse)
    super("not Authorized");

    // Set custom reasons if provided
    if (reasons) {
      this.reasons = reasons;
    }

    // Set custom status code if provided
    if (statusCode) {
      this.statusCode = statusCode;
    }

    // Ensure the correct prototype chain
    Object.setPrototypeOf(this, NotAuthorizeError.prototype);
  }

  /**
   * serializedError returns the serialized format of the error.
   * It includes the custom reasons for the unauthorized access error in the response.
   * @method
   * @returns {Array<{message: string}>} - Serialized error format
   */
  serializedError(): ErrorObject[] {
    return [{ message: this.reasons, success: this.success }];
  }
}
