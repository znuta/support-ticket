/**
 * ValidationError is a custom error class that extends the CustomResponse class.
 * It represents an error indicating validation failure, often associated with user input.
 * The class sets the default HTTP status code to 400 (Bad Request).
 *
 * @class ValidationError
 * @extends CustomResponse
 * @exports ValidationError - Custom error class for validation errors
 * @constructor
 * @param {ValidationError[]} error - An array of express-validator errors representing the validation issues.
 * @author Toyeeb Atunde
 */
import { CustomResponse, ErrorObject } from "./customResponse";
import { ValidationError } from "express-validator";

export class validationError extends CustomResponse {
  /**
   * statusCode represents the HTTP status code for a ValidationError (400).
   * @type {number}
   */
  statusCode = 400;

  /**
   * error is an array of express-validator errors representing the validation issues.
   * @type {ValidationError[]}
   */
  error: ValidationError[];

  /**
   * success represents the HTTP status type boolean.
   * @type {boolean}
   */
  success = false;

  /**
   * Constructor for the ValidationError class.
   * @constructor
   * @param {ValidationError[]} error - An array of express-validator errors representing the validation issues.
   */
  constructor(error: ValidationError[]) {
    // Call the constructor of the base class (CustomResponse)
    super("validation error");

    // Set the array of validation errors
    this.error = error;

    // Ensure the correct prototype chain
    Object.setPrototypeOf(this, validationError.prototype);
  }

  /**
   * serializedError returns the serialized format of the validation error.
   * It maps each validation error to an object with "message" and "field" properties.
   * @method
   * @returns {Array<{message: string, field: string}>} - Serialized validation error format
   */
  serializedError(): ErrorObject[] {
    return this.error.map((err) => {
      //@ts-ignore
      return { message: err.msg, field: err.param, success: this.success };
    });
  }
}
