import request from "supertest";

import { app } from "../../app";

declare const global: {
  [key: string]: any;
};
const euser = "test@test.com";
const password = "password";
describe("Admin Service Integration Tests", () => {
  it("should get a list of users (admin only)", async () => {
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

    // Attempt to get the list of users as an admin
    const getUsersResponse = await request(app)
      .get("/api/v1/admin/users")
      .set("Authorization", `Bearer ${admin.token}`)
      .expect(200);

    // Verify that the response contains user data
    expect(getUsersResponse.body.data[0]).toHaveProperty(
      "email",
      "test@test.com"
    );
  });

  it("should assign a ticket to an agent (admin only)", async () => {
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

    // Create a new ticket
    const createTicketResponse = await request(app)
      .post("/api/v1/ticket/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        subject: "Test Ticket",
        description: "This is a test ticket",
      })
      .expect(201);

    const ticketId = createTicketResponse.body.data.id;

    // Attempt to assign the ticket to the agent as an admin
    const assignTicketResponse = await request(app)
      .post("/api/v1/admin/assign-ticket")
      .set("Authorization", `Bearer ${admin.token}`)
      .send({
        ticketId,
        agentId: userAgentDetailsResponse.body.data.id,
      })
      .expect(200);

    // Verify that the ticket was assigned successfully
    expect(assignTicketResponse.body).toHaveProperty(
      "message",
      "Ticket assigned to agent successfully"
    );
  });

  it("should not allow non-admin users to get a list of users", async () => {
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

    // Attempt to get the list of users as a non-admin user
    const getUsersResponse = await request(app)
      .get("/api/v1/admin/users")
      .set("Authorization", `Bearer ${token}`)
      .expect(400);

    // Verify that non-admin users are denied access
    expect(getUsersResponse.body.error[0]).toHaveProperty(
      "message",
      "Unauthorized"
    );
  });

  it("should not allow non-admin users to assign a ticket to an agent", async () => {
    const { token: customerToken } = await global.signup({
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

    const { id: agentId, token: agentToken } =
      userAgentDetailsResponse.body.data;

    // Create a new ticket
    const createTicketResponse = await request(app)
      .post("/api/v1/ticket/create")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({
        subject: "Test Ticket",
        description: "This is a test ticket",
      })
      .expect(201);

    const ticketId = createTicketResponse.body.data.id;

    // Attempt to assign the ticket to the agent as a non-admin user
    const assignTicketResponse = await request(app)
      .post("/api/v1/admin/assign-ticket")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({
        ticketId,
        agentId,
      })
      .expect(400);

    // Verify that non-admin users are denied access
    expect(assignTicketResponse.body.error[0]).toHaveProperty(
      "message",
      "Unauthorized"
    );
  });
});
