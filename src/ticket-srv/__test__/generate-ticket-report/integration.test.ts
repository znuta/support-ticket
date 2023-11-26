import request from "supertest";

import { app } from "../../../app";

declare const global: {
  [key: string]: any;
};
const euser = "test@test.com";
const password = "password";
describe("Ticket Report Integration Test", () => {
  it("should generate and export a CSV report of closed tickets in the last one month", async () => {
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

    const ticketId = createTicketResponse.body.data.id;

    // Agent should  ticket  to it self, with the obtained ticket ID and user token
    const assignedTicketResponse = await request(app)
      .put(`/api/v1/ticket/assign/${ticketId}`)
      .set(
        "Authorization",
        `Bearer ${userAgentDetailsResponse.body.data.token}`
      )
      .expect(200);

    // Agent should  ticket  to it self, with the obtained ticket ID and user token
    const updateTicketResponse = await request(app)
      .put(`/api/v1/ticket/${ticketId}`)
      .send({
        status: "closed",
      })
      .set(
        "Authorization",
        `Bearer ${userAgentDetailsResponse.body.data.token}`
      )
      .expect(200);

    // Make a request to generate the report
    const response = await request(app)
      .get("/api/v1/ticket/report?format=csv")
      .set("Authorization", `Bearer ${admin.token}`)
      .expect(200);

    // Verify the response format and content type
    expect(response.header["content-type"]).toContain("text/csv");
    expect(response.header["content-disposition"]).toContain(
      "attachment; filename=ticket_report.csv"
    );
  });
});
