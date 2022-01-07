import Datastore from "nedb";

export class DB<T> {
  db: Datastore;

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
  create(data: any): Promise<T> {
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
  find(query: any): Promise<T[]> {
    return new Promise((resolve, reject) =>
      this.db.find<T>(query, {}, (err, docs) => {
        if (err) reject(err);
        resolve(docs);
      })
    );
  }

  findOne(query: any): Promise<T> {
    return new Promise((resolve, reject) =>
      this.db.findOne<T>(query, (err, doc) => {
        if (err) reject(err);
        resolve(doc);
      })
    );
  }

  /**
   * Get an object by it's _id or #dbref.
   * @param  id Either the _id, or dbref of an object.
   * @returns
   */
  get(id: string): Promise<T> {
    return new Promise((resolve, reject) =>
      this.db.findOne<T>({ _id: id }, (err, doc) => {
        if (err) reject(err);
        resolve(doc);
      })
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

  findOneAndUpdate(query: any, update = {}, proj = {}) {
    return new Promise((resolve, reject) =>
      this.db.findOne(query, proj, (err, doc) => {
        if (err) reject(err);
        this.db.update({ _id: doc._id }, update, { upsert: true }, (err) => {
          if (err) reject(err);
          resolve(true);
        });
      })
    );
  }

  /**
   * Delete a database record.
   * @param id The ID of the record to delete
   * @returns
   */
  delete(id: string): Promise<number> {
    return new Promise((resolve, reject) =>
      this.db.remove({ _id: id }, {}, (err, n) => {
        if (err) reject(err);
        resolve(n);
      })
    );
  }
}
