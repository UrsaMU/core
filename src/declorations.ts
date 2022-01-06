import { Expression } from "@ursamu/parser";
import { Socket } from "socket.io";
import { Request } from "express";
import { IConfig } from "config";
export interface Attribute {
  setby: string;
  value: string;
  flags?: string;
  lock?: string;
}

export interface DBObj {
  _id: string;
  dbref: string;
  flags: string;
  name?: string;
  alias?: string;
  password?: string;
  description?: string;
  location?: string;
  owner:string,
  data: {
    [key: string]: any;
  };
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
  pid?: string;
  height?: number;
  width?: number;
}

export interface Context {
  id: string;
  socket?: MUSocket;
  data?: { [key: string]: any };
  player?: DBObj;
  expr?: Expression;
  msg?: string;
  width?: number;
  config?: IConfig;
  res?: string;
}

export interface ChannelEntry {
  _id: string;
  name: string;
  title: string;
  mask: string;
  alias: string;
  joined?: boolean;
}

export interface MuRequest extends Request {
  user?: Partial<DBObj>;
  isStaff?: boolean;
  isWizard?: boolean;
}
