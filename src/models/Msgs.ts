import { Document, model, Schema, SchemaTypes } from "mongoose";

export interface Msg extends Document {
  text: string;
  data: { [key: string]: any };
  tars: string[];
}

const MsgModel = new Schema<Msg>(
  {
    text: String,
    data: SchemaTypes.Mixed,
    tars: SchemaTypes.Array,
  },
  {
    timestamps: true,
  }
);

export const Msgs = model<Msg>("msgs", MsgModel);
