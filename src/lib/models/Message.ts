import mongoose, { Schema, Document, Model } from "mongoose";

export interface MessageDocument extends Document {
  location: {
    lat: number;
    lng: number;
  };
  message: string;
  emoji: string;
  upvotes: number;
}

const MessageSchema = new Schema<MessageDocument>(
  {
    message: {
      type: String,
      required: true,
    },
    location: {
        lat: {
            type: Number,
            required: true,
        },
        lng: {
            type: Number,
            required: true,
        },
    },
    emoji: {
      type: String,
      required: true,
    },
    upvotes: {
        type: Number,
        required: true
    }
  },
  {
    timestamps: true,
  }
);

export const Message: Model<MessageDocument> =
  mongoose.models.Message || mongoose.model<MessageDocument>("Message", MessageSchema);