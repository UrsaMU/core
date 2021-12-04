import { Document, model, Schema, SchemaTypes } from "mongoose";

export interface DBObj extends Document {
  name: string;
  alias?: string;
  password?: string;
  location?: string;
  owner: string;
  dbref: string;
  description: string;
  data?: { [key: string]: any };
  flags?: string;
  channels?: string[];
}

const DBSchema = new Schema<DBObj>(
  {
    dbref: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    alias: String,
    password: String,
    location: String,
    owner: String,
    data: { type: SchemaTypes.Mixed, default: {} },
    description: { type: String, default: "You see nothing special." },
    flags: String,
  },
  { timestamps: true }
);

export const dbObj = model("dbobjs", DBSchema);
