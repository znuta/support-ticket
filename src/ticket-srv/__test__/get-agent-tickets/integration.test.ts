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
  it("should get tickets assigned to agent", async () => {
    // It should create a new user customer
    const user = await global.signup({
      email: euser,
      password: password,
    });
    // It should create a new admin user
    const admin = await global.createAdmin();

    // Admin should create a new agent user
    const userAgentDetailsResponse = await request(app)
      .post(`/api/v1/user/register`)
      .send({
        email: "agent@test.com",
        password: "agentPassword",
        role: "agent",
      })
      .set("Authorization", `Bearer ${admin.token}`)
      .expect(201);

    // Create a new ticket with the obtained user token
    const createTicketResponse = await request(app)
      .post("/api/v1/ticket/create")
      .set("Authorization", `Bearer ${user.token}`)
      .send({
        subject: "Test Ticket",
        description: "This is a test ticket",
      })
      .expect(201);

    const ticketId = createTicketResponse.body.id;

    // Agent should  ticket  to it self, with the obtained ticket ID and user token
    const assignedTicketResponse = await request(app)
      .put(`/api/v1/ticket/${ticketId}`)
      .set("Authorization", `Bearer ${userAgentDetailsResponse.body.token}`)
      .expect(200);

    // Agent should  ticket  to it self, with the obtained ticket ID and user token
    const agentsTicketResponse = await request(app)
      .get(`/api/v1/ticket/support-agents/tickets`)
      .set("Authorization", `Bearer ${userAgentDetailsResponse.body.token}`)
      .expect(200);
  });
});