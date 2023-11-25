/**
 * NotFoundError is a custom error class that extends the CustomResponse class.
 * It represents an error indicating that the requested page or resource was not found.
 * The class sets the HTTP status code to 404 (Not Found) by default.
 *
 * @class NotFoundError
 * @extends CustomResponse
 * @exports NotFoundError - Custom error class for not found errors
 * @constructor
 * @param {string} [reasons] - Optional custom reasons for the not found error.
 * @author Toyeeb Atunde
 */
import { CustomResponse } from "./customResponse";

export class NotFoundError extends CustomResponse {
  /**
   * reasons represent custom reasons for the not found error.
   * @type {string}
   */
  reasons = "page not found!!!";

  /**
   * statusCode represents the HTTP status code for a NotFoundError (404).
   * @type {number}
   */
  statusCode = 404;

  /**
   * Constructor for the NotFoundError class.
   * @constructor
   * @param {string} [reasons] - Optional custom reasons for the not found error.
   */
  constructor(reasons?: string) {
    // Call the constructor of the base class (CustomResponse)
    super("page not found!!!");

    // Set custom reasons if provided
    if (reasons) {
      this.reasons = reasons;
    }

    // Ensure the correct prototype chain
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  /**
   * serializedError returns the serialized format of the error.
   * It includes the custom reasons for the not found error in the response.
   * @method
   * @returns {Array<{message: string}>} - Serialized error format
   */
  serializedError() {
    return [{ message: this.reasons }];
  }
}
