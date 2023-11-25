/**
 * This test suite is for the "registerUser" function in the "controllers.ts" file.
 * It uses Jest and supertest to test the user registration process.
 * It initializes mock request and response objects before each test case.
 * The single test case checks if the function registers a new user successfully.
 *
 * @author Toyeeb Atunde
 */

// Import necessary modules
import request from "supertest";
import { Request, Response } from "express";
import { registerUser } from "../../controllers";

// Describe the test suite
describe("User Service", () => {
  // Declare variables for mock request and response
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  // Run before each test case
  beforeEach(() => {
    // Initialize mock request and response objects
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    };
  });

  // Test case: Register a new user
  it("should register a new user", async () => {
    // Set the request body with user details
    mockRequest.body = {
      email: "test@example.com",
      password: "testpassword",
    };

    // Call the registerUser function with mock request and response
    await registerUser(mockRequest as Request, mockResponse as Response);

    // Expectations
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.send).toHaveBeenCalled();
  });
});
