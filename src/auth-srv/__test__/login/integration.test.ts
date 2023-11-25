import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { app } from "../../../app";

declare const global: {
  [key: string]: any;
};
const euser = "test@test.com";
const password = "password";
describe("User Service Integration Tests", () => {
  it("should register a new user via API", async () => {
    const { id, email, role, token } = await global.signup({
      email: euser,
      password: password,
    });
    const userData = {
      email: euser,
      password: password,
    };

    const response = await request(app)
      .post("/api/v1/user/login")
      .send(userData);

    expect(response.status).toBe(200);
    expect(response.body.email).toBe(userData.email);
  });
});
