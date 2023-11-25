import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { app } from "../../../app";

let mongoServer: MongoMemoryServer;

describe("User Service Integration Tests", () => {
  it("should register a new user via API", async () => {
    const userData = {
      email: "test@example.com",
      password: "testpassword",
    };

    const response = await request(app)
      .post("/api/v1/user/register")
      .send(userData);

    expect(response.status).toBe(201);
    expect(response.body.email).toBe(userData.email);
  });

  // Add other integration tests for loginUser, getUser, and updateUser
});
