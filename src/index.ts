import { Expression } from "@ursamu/parser";
import { Server } from "http";
import { Socket } from "socket.io";
import app from "./api/app";
import broadcast from "./api/broadcast";

export * from "./api/broadcast";
export * from "./api/connections";
export * from "./api/flags";
export * from "./api/hooks";
export * from "./api/parser";
export * from "./api/cmds";
export * from "./utils/utils";
export * from "./api/security";

export interface DBObj {
  _id?: string;
  dbref?: number;

  data: { [key: string]: any; channels?: ChannelEntry[] };
  temp: { [key: string]: any };
  description: string;
  alias?: string;
  attrs: { [key: string]: Attribute };
  name: string;
  flags: string;
  location: string;
  owner: string;
  password?: string;
}

export interface Attribute {
  setby: string;
  value: string;
  flags?: string;
  lock?: string;
}

export interface Article {
  _id?: string;
  body: string;
  category: string;
  slug: string;
  title: string;
  created_by: string;
  created_at?: number;
  last_update?: number;
  edit_by?: string;
  flags?: string;
}

export type Query = { [key: string]: any };
export type Data = { [key: string]: any };

export interface Database<T> {
  create: (data: T) => Promise<T>;
  find: (query: Query, params?: Data) => Promise<T[]>;
  get: (id: string, params?: Data) => Promise<T>;
  update: (query: Partial<T>, data: T) => Promise<T>;
  delete: (id: string) => Promise<any>;
}

export interface MUSocket extends Socket {
  cid?: string;
  dbref?: number;
  width?: number;
}

export interface Context {
  id: string;
  socket: MUSocket;
  data: { [key: string]: any };
  player?: DBObj;
  expr?: Expression;
  msg?: string;
  width?: number;
}

export interface ChannelEntry {
  _id: string;
  name: string;
  title: string;
  mask: string;
  alias: string;
  joined?: boolean;
}

export interface Channel {
  [key: string]: any;
  _id?: string;
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
export interface MuRequest extends Request {
  player?: DBObj;
}

export function mu(server: Server) {
  const io = app(server);
  const msg = broadcast(io);
  return { io, msg };
}
