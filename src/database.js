const Datastore = require("nedb");
const { join } = require("path");

class DB {
  constructor(path) {
    this.db = new Datastore({
      autoload: true,
      filename: path || join(__dirname, "../data/data.db"),
    });
  }

  create(data) {
    return new Promise((resolve, reject) =>
      this.db.insert(data, (err, doc) => {
        if (err) reject(err);
        resolve(doc);
      })
    );
  }

  find(query) {
    return new Promise((resolve, reject) =>
      this.db.find(query, {}, (err, docs) => {
        if (err) reject(err);
        resolve(docs);
      })
    );
  }

  get(id) {
    return new Promise((resolve, reject) =>
      this.db.findOne({ _id: id }, (err, doc) => {
        if (err) reject(err);
        resolve(doc);
      })
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
