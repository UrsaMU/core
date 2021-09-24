import { model, Schema } from "mongoose";
import { ChannelEntry } from "../api/channels";
import { hash } from "../utils/utils";

export interface IDbObj extends Document {
  dbref?: number;
  data: { [key: string]: any; channels?: ChannelEntry[] };
  temp: { [key: string]: any };
  description: string;
  alias?: string;
  name: string;
  flags: string;
  loc: string;
  owner: string;
  password?: string;
}

export const DbObjSchema = new Schema<IDbObj>({
  dbref: { type: Number, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  password: { type: String, default: "" },
  data: {
    type: Schema.Types.Mixed,
    default: { channels: { type: Array, default: [] } },
  },
  temp: {
    type: Schema.Types.Mixed,
    default: {},
  },
  description: { type: String, default: "" },
  alias: { type: String, default: "" },
  loc: { type: String, default: "" },
  owner: { type: String, default: "" },
});

export const DbObj = model("DbObj", DbObjSchema);