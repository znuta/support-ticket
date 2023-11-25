/**
 * UserInterface.ts defines the interfaces used for the User model.
 *
 * @author Toyeeb Atunde
 */

// Import mongoose for types and model creation
import mongoose from "mongoose";

// Define the Role type
export type Role = "customer" | "agent" | "admin";

// Define the UserAttrs interface for user attributes
export interface UserAttrs {
  email: string;
  password: string;
  role?: Role;
}

// Define the UserDoc interface for the user document
export interface UserDoc extends mongoose.Document {
  id: string;
  email: string;
  password: string;
  role: Role;
}

// Define the UserModel interface for the user model
export interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}
