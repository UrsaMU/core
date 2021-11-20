import { Document, model, Schema, SchemaTypes } from "mongoose";

export interface Msg extends Document {
  text: string;
  data: { [key: string]: any };
  tars: string[];
}

const MsgModel = new Schema(
  {
    text: { type: String, required: true },
    data: SchemaTypes.Mixed,
    tars: { type: Array, required: true },
  },
  {
    timestamps: true,
  }
);

export const Msgs = model("msgs", MsgModel);
