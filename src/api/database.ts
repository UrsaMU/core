import Datastore from "nedb";

export interface DBObj {
  _id?: string;
  data: { [key: string]: any };
  temp: { [key: string]: any };
  description: string;
  alias?: string;
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
  hidden?: boolean;
  locked?: string;
  flags?: string;
}

type Query = { [key: string]: any };
type DBs = { [key: string]: DB<any> };

export class DB<T> {
  db: Datastore;
  static dbs: DBs;
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
      this.db.insert<T>(data, (err, doc) => {
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
  find(query: Query): Promise<T[]> {
    return new Promise((resolve, reject) =>
      this.db.find<T>(query, {}, (err, docs) => {
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
  get(id: string | number): Promise<T> {
    return new Promise((resolve, reject) =>
      this.db.findOne<T>(
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
  update(query: Query, update: Partial<T>): Promise<number> {
    return new Promise((resolve, reject) =>
      this.db.update(query, update, { returnUpdatedDocs: true }, (err, doc) => {
        if (err) reject(err);
        resolve(doc);
      })
    );
  }

  /**
   * Attach a new daatabase to the database system.
   * @param label The label the db will be referred to by the system.
   * @param db The DB object to save.
   */
  static attach<T>(label: string, db: DB<T>) {
    if (!DB.dbs) {
      DB.dbs = {};
    }

    DB.dbs[label] = db;
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
