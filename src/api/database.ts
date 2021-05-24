import Datastore from "nedb";
import { join } from "path";

export interface DBObj {
  _id?: string;
  data: { [key: string]: any };
  temp: { [key: string]: any };
  description: string;
  attrs: { [key: string]: Attribute };
  name: string;
  dbref: number;
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

type Query = { [key: string]: any };

export class DB {
  db: Datastore;
  /**
   *  Create a new database instance
   * @param {string} path  The absolute path to where the db file should be saved.
   */
  constructor(path?: string) {
    this.db = new Datastore<DBObj>({
      autoload: true,
      filename: path || join(__dirname, "../data/data.db"),
    });
  }

  /**
   * Create a new game entity.
   * @param data
   * @returns
   */
  create(data: DBObj): Promise<DBObj> {
    return new Promise((resolve, reject) =>
      this.db.insert<DBObj>(data, (err, doc) => {
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
  find(query: Query): Promise<DBObj[]> {
    return new Promise((resolve, reject) =>
      this.db.find<DBObj>(query, {}, (err, docs) => {
        if (err) reject(err);
        resolve(docs);
      })
    );
  }

  /**
   * Get an object by it's _id or #dbref.
   * @param  id Either the _id, or dbref of an object.
   * @returns
   */
  get(id: string | number) {
    return new Promise((resolve, reject) =>
      this.db.findOne<DBObj>(
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
  update(query: Query, update: Partial<DBObj>): Promise<number> {
    return new Promise((resolve, reject) =>
      this.db.update(query, update, { returnUpdatedDocs: true }, (err, doc) => {
        if (err) reject(err);
        resolve(doc);
      })
    );
  }

  delete(id: string | number): Promise<number> {
    return new Promise((resolve, reject) =>
      this.db.remove({ _id: id }, {}, (err, n) => {
        if (err) reject(err);
        resolve(n);
      })
    );
  }
}

export const wiki = new DB(join(__dirname, "../../wiki.db"));
export const db = new DB();
