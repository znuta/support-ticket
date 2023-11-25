import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { app } from "../../../app";

let mongoServer: MongoMemoryServer;
declare const global: {
  [key: string]: any;
};

const euser = "test@test.com";
const password = "password";
describe("Ticket Service Integration Tests", () => {
  it("should create a new ticket", async () => {
    const { id: userId, token } = await global.signup({
      email: euser,
      password: password,
    });

    // Create a new ticket with the obtained user token
    const createTicketResponse = await request(app)
      .post("/api/v1/ticket/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        subject: "Test Ticket",
        description: "This is a test ticket",
      })
      .expect(201);
  });
});
