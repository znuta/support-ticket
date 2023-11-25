/**
 * NotAuthorizeError is a custom error class that extends the CustomResponse class.
 * It represents an error indicating that the user is not authorized to perform a certain action.
 * The class sets the HTTP status code to 400 (Bad Request) by default.
 *
 * @class NotAuthorizeError
 * @extends CustomResponse
 * @exports NotAuthorizeError - Custom error class for authorization-related errors
 * @constructor
 * @param {string} [reasons] - Optional custom reasons for the authorization error.
 * @param {number} [statusCode] - Optional HTTP status code for the error (default is 400).
 * @author Toyeeb Atunde
 */
import { CustomResponse } from "./customResponse";

export class NotAuthorizeError extends CustomResponse {
  /**
   * statusCode represents the HTTP status code for a NotAuthorizeError (400).
   * @type {number}
   */
  statusCode = 400;

  /**
   * reasons represent custom reasons for the authorization error.
   * @type {string}
   */
  reasons = "Please login or register to continue";

  /**
   * Constructor for the NotAuthorizeError class.
   * @constructor
   * @param {string} [reasons] - Optional custom reasons for the authorization error.
   * @param {number} [statusCode] - Optional HTTP status code for the error (default is 400).
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
   * It includes the custom reasons for the authorization error in the response.
   * @method
   * @returns {Array<{message: string}>} - Serialized error format
   */
  serializedError() {
    return [{ message: this.reasons }];
  }
}
