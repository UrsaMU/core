import { Document, model, Schema } from "mongoose";

export interface Channel extends Document {
  [key: string]: any;
  name: string;
  header?: string;
  display?: string;
  access?: string;
  read?: string;
  write?: string;
  modify?: string;
  private?: boolean;
  loud?: boolean;
  mask?: boolean;
  alias?: string;

  description?: string;
}

const channelSchema = new Schema<Channel>({
  name: { type: String, unique: true, required: true },
  header: String,
  display: String,
  acess: String,
  read: String,
  write: String,
  modify: { type: String, default: "staff+" },
  private: String,
  loud: Boolean,
  mask: Boolean,
  alias: String,
  description: String,
});

export const chans = model("chans", channelSchema);
