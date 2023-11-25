/**
 * user.ts defines the mongoose schema and model for the User entity.
 * It includes the schema definition, pre-save middleware for password hashing,
 * and static method to create a new User instance.
 *
 * @author Toyeeb Atunde
 */

// Import mongoose for schema and model creation
import mongoose from "mongoose";

// Import the Password utility from the common module for password hashing
import { Password } from "../../common";

// Import the interfaces for User attributes, document, and model
import { UserAttrs, UserDoc, UserModel } from "./UserInterface";

// Define the mongoose schema for the User entity
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["customer", "agent", "admin"],
      default: "customer",
    },
  },
  {
    // Define a transform function to modify the returned JSON representation of the document
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
      },
    },
    // Allow fields not defined in the schema to be stored in the document
    strict: false,
  }
);

// Define a pre-save middleware to hash the password before saving
userSchema.pre("save", async function (done) {
  if (!this.get("password")) return done();
  if (this.isModified("password")) {
    try {
      const hashed = await Password.toHash(this.get("password")!);
      this.set("password", hashed);
      done();
    } catch (err) {
      console.log("Password hashing error:", err);
    }
  }
});

// Define a static method to create a new User instance
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

// Create the User model using the mongoose schema
const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

// Export the User model
export { User };
