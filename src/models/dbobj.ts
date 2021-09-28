import { model, Schema } from "mongoose";
import { ChannelEntry } from "../api/channels";

export interface IDbObj extends Document {
  dbref: string;
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
  dbref: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  password: { type: String, default: "" },

  data: {
    type: Schema.Types.Mixed,
    default: { channels: { type: Array } },
  },
  temp: {
    type: Schema.Types.Mixed,
    default: {},
  },
  description: { type: String, default: "You see nothing special." },
  flags: { type: String, default: "" },
  alias: { type: String, default: "" },
  loc: { type: String },
  owner: { type: String, default: "" },
});

export const DbObj = model("DbObj", DbObjSchema);
