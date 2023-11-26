import request from "supertest";

import { app } from "../../../app";

declare const global: {
  [key: string]: any;
};
const euser = "test@test.com";
const password = "password";
describe("User Service Integration Tests", () => {
  it("should register a new user, and get user details", async () => {
    const { id, email, role, token } = await global.signup({
      email: euser,
      password: password,
    });
    // Get user details with the obtained token
    const userDetailsResponse = await request(app)
      .get(`/api/v1/user/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(userDetailsResponse.body.data).toHaveProperty("id", id);
  });
});
