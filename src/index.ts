import { Expression } from "@ursamu/parser";
import { Socket } from "socket.io";
export * from "./api/broadcast";
export * from "./api/app";
export * from "./api/broadcast";
export * from "./api/flags";
export * from "./api/hooks";
export * from "./api/parser";
export * from "./api/cmds";
export * from "./api/plugins";
export * from "./api/security";

export interface DBObj {
  _id?: string;
  dbref?: string;
  flags: string;

  data: {
    [key: string]: any;
    channels?: ChannelEntry[];
    description: string;
    alias?: string;
    attrs?: { [key: string]: any };
    name: string;
    location?: string;
    owner: string;
    destination?: string;
    password?: string;
  };
}

export interface Attribute {
  setby: string;
  value: string;
  flags?: string;
  lock?: string;
}

export type Query = { [key: string]: any };
export type Data = { [key: string]: any };

export interface Database<T> {
  create: (data: T) => Promise<T>;
  find: (query: Query, params?: Data) => Promise<T[]>;
  fineOne: (query: Query, params?: Data) => Promise<T>;
  get: (id: string, params?: Data) => Promise<T>;
  update: (query: Partial<T>, data: T) => Promise<T>;
  delete: (id: string) => Promise<any>;
}

export interface MUSocket extends Socket {
  cid?: string;
  uid?: string;
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

const startup = async (callback: () => {}) => {};
