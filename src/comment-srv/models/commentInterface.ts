/**
 * CommentInterface.ts defines the interfaces used for the Comment model.
 *
 * @author Toyeeb Atunde
 */

// Import mongoose for types and model creation
import mongoose from "mongoose";

// Define the CommentAttrs interface for Comment attributes
export interface CommentAttrs {
  ticket: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  userRole: string;
  text: string;
}

// Define the CommentDoc interface for the Comment document
export interface CommentDoc extends mongoose.Document {
  ticket: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  userRole: string;
  text: string;
  createdAt: Date;
}

// Define the CommentModel interface for the Comment model
export interface CommentModel extends mongoose.Model<CommentDoc> {
  build(attrs: CommentAttrs): CommentDoc;
}
