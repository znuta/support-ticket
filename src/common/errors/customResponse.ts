/**
 * CustomResponse is an abstract class that extends the built-in Error class.
 * It serves as a base class for custom error classes, providing a common structure
 * for error handling in the application. Subclasses must implement the 'statusCode'
 * property and the 'serializedError' method to define the HTTP status code and the
 * serialized error response format, respectively.
 *
 * @abstract
 * @class CustomResponse
 * @extends Error
 * @exports CustomResponse - Abstract class for custom error responses
 * @author Toyeeb Atunde
 */
export abstract class CustomResponse extends Error {
  /**
   * statusCode is an abstract property that must be implemented by subclasses.
   * It represents the HTTP status code associated with the custom error.
   *
   * @abstract
   * @type {number}
   */
  abstract statusCode: number;

  /**
   * success is an abstract property that must be implemented by subclasses.
   * It represents the HTTP status type.
   *
   * @abstract
   * @type {boolean}
   */
  abstract success: boolean;

  /**
   * Constructor for the CustomResponse class.
   * @constructor
   * @param {string} message - Error message
   */
  constructor(message: string) {
    // Call the constructor of the base class (Error)
    super(message);

    // Ensure the correct prototype chain
    Object.setPrototypeOf(this, CustomResponse.prototype);
  }

  /**
   * serializedError is an abstract method that must be implemented by subclasses.
   * It returns the serialized format of the error, including the message and optional
   * field information.
   *
   * @abstract
   * @method
   * @returns {Array<{message: string, field?: string}>} - Serialized error format
   */
  abstract serializedError(): ErrorObject[];
}

export interface ErrorObject {
  message: string;
  field?: string;
  success: boolean;
  [key: string]: any;
}
