import { Data } from "./app";

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

type Query = { [key: string]: any };

export interface Database<T> {
  create: (data: T) => Promise<T>;
  find: (query: Query, params?: Data) => Promise<T[]>;
  get: (id: string, params?: Data) => Promise<T>;
  update: (query: Partial<T>, data: T) => Promise<T>;
  delete: (id: string) => Promise<any>;
  start: () => Promise<void>;
}

class DB {}
