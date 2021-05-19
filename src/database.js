const Datastore = require("nedb");
const { join } = require("path");

class DB {
  /**
   *  Create a new database instance
   * @param {string} path  The absolute path to where the db file should be saved.
   */
  constructor(path) {
    this.db = new Datastore({
      autoload: true,
      filename: path || join(__dirname, "../data/data.db"),
    });
  }

  /**
   * @typedef {object} DBObj
   * @property {string} _id The identifier
   * @property {object} data Any extra bits of data we want to temp save on
   * the object.  Disposable/mutable.
   * @property {object} attrs In-game attributes.
   * @property {string} name The name of the entity
   * @property {string} flags The flags that make up the entity.
   * @property {string} location The entities current location
   * @property {string} owner Who owns the entity?
   * @returns
   */

  /**
   * Create a new game entity.
   * @param {DBObj} data
   * @returns
   */
  create(data) {
    return new Promise((resolve, reject) =>
      this.db.insert(data, (err, doc) => {
        if (err) reject(err);
        resolve(doc);
      })
    );
  }

  /**
   * Find a db object with a mongodb query.
   * @param {object} query
   * @returns {DBObj[]}
   */
  find(query) {
    return new Promise((resolve, reject) =>
      this.db.find(query, {}, (err, docs) => {
        if (err) reject(err);
        resolve(docs);
      })
    );
  }

  /**
   * Get an object by it's _id or #dbref.
   * @param {string | number} id Either the _id, or dbref of an object.
   * @returns {Promise<DBObj>}
   */
  get(id) {
    return new Promise((resolve, reject) =>
      this.db.findOne(
        {
          $where: function () {
            if (
              this._id === id ||
              this.dbref === id ||
              this.dbref == parseInt(id.slice(1), 10)
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

  update(query, update) {
    return new Promise((resolve, reject) =>
      this.db.update(query, update, { returnUpdatedDocs: true }, (err, doc) => {
        if (err) reject(err);
        resolve(doc);
      })
    );
  }

  delete(id) {
    return new Promise((resolve, reject) =>
      this.db.remove({ _id: id }, {}, (err, n) => {
        if (err) reject(err);
        resolve(n);
      })
    );
  }
}

module.exports.DB = DB;
