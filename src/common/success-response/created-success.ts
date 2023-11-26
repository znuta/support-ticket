import { SuccessObject, SuccessResponse } from "./customResponse";

/**
 * CreatedSuccessResponse is a concrete class that extends SuccessResponse.
 * It represents a successful response with a 201 Created status code.
 *
 * @class CreatedSuccessResponse
 * @extends SuccessResponse
 * @exports CreatedSuccessResponse - Class for a 201 Created successful response
 * @author Toyeeb Atunde
 */
export class CreatedSuccessResponse extends SuccessResponse {
  /**
   * success represents the HTTP status type true.
   *
   * @type {number}
   */
  success: boolean = true;

  /**
   * statusCode represents the HTTP status code 201 Created.
   *
   * @type {number}
   */
  readonly statusCode: number = 201;

  /**
   * data is an example property representing the success data.
   *
   * @type {SuccessObject}
   */
  private data: SuccessObject;

  /**
   * Constructor for the CreatedSuccessResponse class.
   * @constructor
   * @param {SuccessObject} data - The success data to be serialized
   */
  constructor(data: { message: string; data?: object | object[] }) {
    super();
    this.data = { ...data, success: this.success };
  }

  /**
   * serializedData returns the serialized format of the success data.
   *
   * @method
   * @returns {SuccessObject} - Serialized success data format
   */
  serializedData(): SuccessObject {
    return this.data;
  }
}
