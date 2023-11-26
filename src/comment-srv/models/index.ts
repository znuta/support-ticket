/**
 * comment.ts defines the mongoose schema and model for the Comment entity.
 * It includes the schema definition, and the toJSON transform to modify the returned JSON representation of the document.
 * The Comment entity represents comments made on a ticket by users with different roles.
 *
 * @author Toyeeb Atunde
 */

// Import necessary modules
import mongoose, { Schema, Document } from "mongoose";
import { CommentAttrs, CommentDoc, CommentModel } from "./commentInterface";

// Define the mongoose schema for the Comment entity
const commentSchema = new Schema(
  {
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userRole: {
      type: String,
      required: true,
      enum: ["customer", "agent", "admin"],
    },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    // Define a toJSON transform to modify the returned JSON representation of the document
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
    // Allow fields not defined in the schema to be stored in the document
    strict: false,
  }
);

// Define a static method to create a new Comment instance
commentSchema.statics.build = (attrs: CommentAttrs) => {
  return new Comment(attrs);
};

// Create the Comment model using the mongoose schema
export const Comment = mongoose.model<CommentDoc, CommentModel>(
  "Comment",
  commentSchema
);
