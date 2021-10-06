import { Document, model, Schema } from "mongoose";

export interface ChannelEntry {
  name: string;
  title: string;
  mask: string;
  alias: string;
  joined?: boolean;
}

export interface Channel extends Document {
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
  chars?: string[];

  description?: string;
}
export const CHannelSchema = new Schema<Channel>({
  name: { type: String, required: true, unique: true },
  header: String,
  display: String,
  access: { type: String, default: "" },
  read: { type: String, default: "" },
  write: { type: String, default: "" },
  modify: { type: String, default: "wizard+" },
  private: { type: Boolean, default: false },
  loud: { type: Boolean, default: false },
  mask: { type: Boolean, default: false },
  alias: { type: String, default: "" },
  chars: { type: Schema.Types.Array },
});

export const Chann = model("Chann", CHannelSchema);
