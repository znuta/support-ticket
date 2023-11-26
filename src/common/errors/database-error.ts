/**
 * DatabaseError is a custom error class that extends the CustomResponse class.
 * It represents an error related to the unavailability or failure of a database service.
 * The class sets the HTTP status code to 500 (Internal Server Error) by default.
 *
 * @class DatabaseError
 * @extends CustomResponse
 * @exports DatabaseError - Custom error class for database-related errors
 * @constructor
 * @author Toyeeb Atunde
 */
import { CustomResponse, ErrorObject } from "./customResponse";

export class DatabaseError extends CustomResponse {
  /**
   * databaseMessage represents a custom message indicating that the database service is not available.
   * @type {string}
   */
  databaseMessage = "service not available!!!";

  /**
   * statusCode represents the HTTP status code for a database error (500).
   * @type {number}
   */
  statusCode = 500;

  /**
   * success represents the HTTP status type boolean.
   * @type {boolean}
   */
  success = false;

  /**
   * Constructor for the DatabaseError class.
   * @constructor
   */
  constructor() {
    // Call the constructor of the base class (CustomResponse)
    super("service not available!!!");

    // Ensure the correct prototype chain
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }

  /**
   * serializedError returns the serialized format of the error.
   * It includes the custom database error message in the response.
   * @method
   * @returns {Array<{message: string}>} - Serialized error format
   */
  serializedError(): ErrorObject[] {
    return [{ message: this.databaseMessage, success: this.success }];
  }
}
