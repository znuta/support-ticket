/**
 * BadRequestError is a custom error class that extends the CustomResponse class.
 * It represents a client error where the request is malformed or contains invalid
 * parameters. The class sets the HTTP status code to 400 (Bad Request) by default,
 * but allows specifying a different status code during instantiation.
 *
 * @class BadRequestError
 * @extends CustomResponse
 * @exports BadRequestError - Custom error class for bad client requests
 * @param {string} message - Error message describing the bad request
 * @param {number} [statusCode] - Optional HTTP status code (default: 400)
 * @constructor
 * @author [Author Name]
 */
import { CustomResponse } from "./customResponse";

export class BadRequestError extends CustomResponse {
  /**
   * statusCode represents the HTTP status code for a bad request (400).
   * @type {number}
   */
  statusCode = 400;

  /**
   * Constructor for the BadRequestError class.
   * @constructor
   * @param {string} message - Error message describing the bad request
   * @param {number} [statusCode] - Optional HTTP status code (default: 400)
   */
  constructor(message: string, statusCode?: number) {
    // Call the constructor of the base class (CustomResponse)
    super(message);

    // Override the default status code if a custom one is provided
    if (statusCode) {
      this.statusCode = statusCode;
    }

    // Ensure the correct prototype chain
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  /**
   * serializedError returns the serialized format of the error.
   * It includes the error message in the response.
   * @method
   * @returns {Array<{message: string}>} - Serialized error format
   */
  serializedError() {
    return [{ message: this.message }];
  }
}
