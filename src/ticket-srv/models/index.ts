// Import necessary modules and types from mongoose
import mongoose, { Schema, Document } from "mongoose";
import { TicketAttrs, TicketDoc, TicketModel } from "./ticketInterface";

// Create a new mongoose schema for the Ticket entity
const ticketSchema = new Schema(
  {
    // Define the 'customer' field with reference to the 'User' model
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the 'User' model
      required: true,
    },
    // Define the 'subject' field of type String, required
    subject: { type: String, required: true },
    // Define the 'description' field of type String, required
    description: { type: String, required: true },
    // Define the 'status' field with enum values 'open' or 'closed', default to 'open'
    status: { type: String, enum: ["open", "closed"], default: "open" },
    // Define the 'createdAt' field of type Date, default to the current date
    createdAt: { type: Date, default: Date.now },
    // Define the 'closedAt' field of type Date, default to null
    closedAt: { type: Date, default: null },
    // Define the 'assignedAgent' field with reference to the 'User' model, default to null
    assignedAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the 'User' model
      default: null,
    },
  },
  {
    // Define the toJSON options for transforming the document
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

// Define a static method to create a new User instance
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};

// Create the Ticket model using the mongoose schema
export const Ticket = mongoose.model<TicketDoc, TicketModel>(
  "Ticket",
  ticketSchema
);
