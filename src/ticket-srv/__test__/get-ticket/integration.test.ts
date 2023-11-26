import request from "supertest";

import { app } from "../../../app";

declare const global: {
  [key: string]: any;
};

const euser = "test@test.com";
const password = "password";
describe("Ticket Service Integration Tests", () => {
  it("should get ticket details", async () => {
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

    const ticketId = createTicketResponse.body.data.id;

    // Get ticket details with the obtained ticket ID and user token
    const getTicketResponse = await request(app)
      .get(`/api/v1/ticket/${ticketId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(getTicketResponse.body.data).toHaveProperty(
      "subject",
      "Test Ticket"
    );
  });
});
