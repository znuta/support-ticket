import request from "supertest";

import { app } from "../../../app";

declare const global: {
  [key: string]: any;
};
const euser = "test@test.com";
const password = "password";
describe("User Service Integration Tests", () => {
  it("should register a new user, and update user details", async () => {
    const { id, email, role, token } = await global.signup({
      email: euser,
      password: password,
    });
    const newPass = "newPass";
    // Update user details with the obtained token
    const userDetailsResponse = await request(app)
      .put(`/api/v1/user/${id}`)
      .send({
        password: newPass,
      })
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
  });
});
