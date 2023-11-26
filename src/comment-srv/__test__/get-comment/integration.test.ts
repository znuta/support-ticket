import request from "supertest";

import { app } from "../../../app";

declare const global: {
  [key: string]: any;
};

const euser = "test@test.com";
const password = "password";
const TIMEOUT = 20000; // Set the timeout to 10 seconds

describe("Comment Service Integration Tests", () => {
  it("should get comment details", async () => {
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
    const ticketId = createTicketResponse.body.data.id;
    // Agent should  ticket  to it self, with the obtained ticket ID and user token
    const updateTicketResponse = await request(app)
      .put(`/api/v1/ticket/assign/${ticketId}`)
      .set(
        "Authorization",
        `Bearer ${userAgentDetailsResponse.body.data.token}`
      )
      .expect(200);
    // Create a new comment with the obtained user token and ticket ID
    const createCommentResponse = await request(app)
      .post("/api/v1/comment/create")
      .set(
        "Authorization",
        `Bearer ${userAgentDetailsResponse.body.data.token}`
      )
      .send({
        ticketId,
        text: "This is a test comment",
      })
      .expect(201);
    const commentId = createCommentResponse.body.data.id;
    // Get comment details with the obtained comment ID and user token
    const getCommentResponse = await request(app)
      .get(`/api/v1/comment/${commentId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    // Verify that the comment details match the expected content
    expect(getCommentResponse.body.data).toHaveProperty(
      "text",
      "This is a test comment"
    );
  });
});
