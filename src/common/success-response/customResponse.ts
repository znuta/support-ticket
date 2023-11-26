/**
 * SuccessResponse is an abstract class that represents a successful response in the application.
 * Subclasses must implement the 'statusCode' property and the 'serializedData' method to define
 * the HTTP status code and the serialized success data format, respectively.
 *
 * @abstract
 * @class SuccessResponse
 * @exports SuccessResponse - Abstract class for successful responses
 * @author Toyeeb Atunde
 */
export abstract class SuccessResponse {
  /**
   * statusCode is an abstract property that must be implemented by subclasses.
   * It represents the HTTP status code associated with the success response.
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
   * Constructor for the SuccessResponse class.
   * @constructor
   */
  constructor() {}

  /**
   * serializedData is an abstract method that must be implemented by subclasses.
   * It returns the serialized format of the success data.
   *
   * @abstract
   * @method
   * @returns {object} - Serialized success data format
   */
  abstract serializedData(): SuccessObject;
}

export interface SuccessObject {
  message: string;
  data?: object | object[] | string | Buffer;
  success: boolean;
  [key: string]: any;
}
