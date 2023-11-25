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
describe("Comment Service Integration Tests", () => {
  it("should update comment details", async () => {
    const { id: userId, token } = await global.signup({
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
    // Create a new ticket to associate the comment with
    const createTicketResponse = await request(app)
      .post("/api/v1/ticket/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        subject: "Test Ticket",
        description: "This is a test ticket",
      })
      .expect(201);
    const ticketId = createTicketResponse.body.id;
    // Agent should  ticket  to it self, with the obtained ticket ID and user token
    const updateTicketResponse = await request(app)
      .put(`/api/v1/ticket/assign/${ticketId}`)
      .set("Authorization", `Bearer ${userAgentDetailsResponse.body.token}`)
      .expect(200);
    // Create a new comment with the obtained user token and ticket ID
    const createCommentResponse = await request(app)
      .post("/api/v1/comment/create")
      .set("Authorization", `Bearer ${userAgentDetailsResponse.body.token}`)
      .send({
        ticketId,
        text: "This is a test comment",
        userRole: "agent",
      })
      .expect(201);
    const commentId = createCommentResponse.body.id;
    // Update comment details with the obtained comment ID and user token
    const updateCommentResponse = await request(app)
      .put(`/api/v1/comment/${commentId}`)
      .set("Authorization", `Bearer ${userAgentDetailsResponse.body.token}`)
      .send({
        text: "Updated test comment",
      })
      .expect(200);
    // Verify that the comment was updated successfully
    expect(updateCommentResponse.body).toHaveProperty(
      "message",
      "Comment details updated successfully"
    );
  });
});
