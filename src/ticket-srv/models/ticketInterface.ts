/**
 * TicketInterface.ts defines the interfaces used for the Ticket model.
 *
 * @author Toyeeb Atunde
 */

// Import mongoose for types and model creation
import mongoose from "mongoose";

// Define the TicketAttrs interface for Ticket attributes
export interface TicketAttrs {
  customer: mongoose.Types.ObjectId;
  subject: string;
  description: string;
}

// Define the TicketDoc interface for the Ticket document
export interface TicketDoc extends mongoose.Document {
  customer: mongoose.Types.ObjectId;
  subject: string;
  description: string;
  status: "open" | "closed";
  createdAt: Date;
  closedAt?: Date | null;
  assignedAgent?: mongoose.Types.ObjectId | null;
}

// Define the TicketModel interface for the Ticket model
export interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}
