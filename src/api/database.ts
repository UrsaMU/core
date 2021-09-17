import Datastore from "nedb";
import { ChannelEntry, Data } from "./app";

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

type Query = { [key: string]: any };

export interface Database<T> {
  create: (data: T) => Promise<T>;
  find: (query: Query, params?: Data) => Promise<T[]>;
  get: (id: string, params?: Data) => Promise<T>;
  update: (query: Partial<T>, data: T) => Promise<T>;
  delete: (id: string) => Promise<any>;
}

export class DB<T> {
  db: Datastore<T>;
  /**
   *  Create a new database instance
   * @param {string} path  The absolute path to where the db file should be saved.
   */

  constructor(path: string) {
    this.db = new Datastore<T>({
      autoload: true,
      filename: path,
    });
  }

  /**
   * Create a new game entity.
   * @param data
   * @returns
   */
  create(data: T): Promise<T> {
    return new Promise((resolve, reject) =>
      this.db.insert(data, (err, doc) => {
        if (err) reject(err);
        resolve(doc);
      })
    );
  }

  /**
   * Find a db object with a mongodb query.
   * @param query
   * @returns
   */
  find(query: any, pred: Partial<T> = {}): Promise<T[] | []> {
    return new Promise((resolve, reject) =>
      this.db.find(query, pred, (err, docs) => {
        if (err) reject(err);
        resolve(docs || []);
      })
    );
  }

  /**
   * Get an object by it's _id or #dbref.
   * @param  id Either the _id, or dbref of an object.
   * @returns
   */
  get(id: string | number): Promise<T | void> {
    return new Promise((resolve, reject) =>
      this.db.findOne(
        {
          $where: function () {
            if (
              this._id === id ||
              this.dbref === id ||
              (typeof id === "string" &&
                this.dbref == parseInt(id.slice(1), 10))
            )
              return true;
            return false;
          },
        },
        (err, doc) => {
          if (err) reject(err);
          resolve(doc);
        }
      )
    );
  }

  /**
   * Update a db entity
   * @param query The dbobjs you want to search for and update
   * @param update The update to push.  Note:  Update producs a new object.
   * @returns
   */
  update(query: any, update: Partial<T>): Promise<number> {
    return new Promise((resolve, reject) =>
      this.db.update(query, update, { returnUpdatedDocs: true }, (err, doc) => {
        if (err) reject(err);
        resolve(doc);
      })
    );
  }

  /**
   * Delete a database record.
   * @param id The ID of the record to delete
   * @returns
   */
  delete(id: string | number): Promise<number> {
    return new Promise((resolve, reject) =>
      this.db.remove({ _id: id }, {}, (err, n) => {
        if (err) reject(err);
        resolve(n);
      })
    );
  }
}
