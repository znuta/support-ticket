// Import necessary modules and types from mongoose
import mongoose, { Schema, Document } from "mongoose";

// Define the TicketModel interface, extending mongoose Document
interface TicketModel extends Document {
  customer: mongoose.Types.ObjectId;
  subject: string;
  description: string;
  status: "open" | "closed";
  createdAt: Date;
  closedAt?: Date | null;
  assignedAgent?: mongoose.Types.ObjectId | null;
}

// Create a new mongoose schema for the Ticket entity
const ticketSchema = new Schema<TicketModel>(
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

// Create the Ticket model using the mongoose schema
export const Ticket = mongoose.model<TicketModel>("Ticket", ticketSchema);
