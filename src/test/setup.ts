/**
 * Testing setup for integration tests using Jest, Supertest, and MongoDB Memory Server.
 * @author Toyeeb Atunde
 */

import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";
import { UserAttrs, UserDoc } from "../auth-srv/models/UserInterface";
import { User } from "../auth-srv/models";

// Declare 'global' with an index signature
declare const global: {
  [key: string]: any;
};

// Extend the NodeJS namespace to include a Global interface
declare global {
  namespace NodeJS {
    interface Global {
      /**
       * Helper function to simulate user registration through the API.
       * @function signup
       * @param {UserAttrs} param - User registration parameters.
       * @returns {Promise<object>} - A promise resolving to the user registration response.
       */
      signup(user: UserAttrs): Promise<object>;

      /**
       * Helper function to create a root admin user and return its details.
       * @function createAdmin
       * @param {UserAttrs} param - Admin user parameters.
       * @returns {Promise<UserDoc>} - A promise resolving to the admin user details.
       */
      createAdmin(param: UserAttrs): Promise<UserDoc>;
    }
  }
}

let mongo: MongoMemoryServer;

/**
 * Before all tests, set up the MongoDB Memory Server and connect Mongoose to it.
 */
beforeAll(async () => {
  process.env.JWT_KEY = "asdfasdf";
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
}, 10000); // Set the timeout to 10000 ms (10 seconds)

/**
 * Before each test, clear the database collections.
 */
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

/**
 * After all tests, stop the MongoDB Memory Server and close the Mongoose connection.
 */
afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

/**
 * Global helper function to simulate user registration through the API.
 */
global.signup = async (param: UserAttrs): Promise<object> => {
  const { email, password, role } = param;
  const response = await request(app)
    .post("/api/v1/user/register")
    .send({
      email,
      password,
      role,
    })
    .expect(201);

  const user = response.body;

  if (!user) {
    throw new Error("No token found in response body");
  }

  return user;
};

/**
 * Global helper function to create a root admin user and return its details.
 */
global.createAdmin = async (param: UserAttrs): Promise<UserDoc> => {
  // Check if a root admin already exists
  const existingAdmin = await User.findOne({ role: "admin" });

  if (!existingAdmin) {
    // Create a new root admin
    const rootAdmin = User.build({
      email: "admin@test.com",
      password: "adminpassword", // You should hash the password in a real application
      role: "admin",
    });

    const admin = await rootAdmin.save();

    const response = await request(app)
      .post("/api/v1/user/login")
      .send({
        email: "admin@test.com",
        password: "adminpassword",
      })
      .expect(200);

    const user = response.body;

    if (!user) {
      throw new Error("No token found in response body");
    }

    return user;
  }

  // If a root admin already exists, log in and return the details
  const response = await request(app)
    .post("/api/v1/user/login")
    .send({
      email: "admin@test.com",
      password: "adminpassword",
    })
    .expect(200);

  const user = response.body;
  return user;
};
