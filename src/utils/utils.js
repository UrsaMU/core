const { readdir } = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.processDir = (path, cb) => {
  readdir(path, (err, files) => {
    if (err) return console.log(err);
    files.forEach((file) => cb(file, path));
  });
};

module.exports.hash = (pass) =>
  new Promise((resolve, reject) =>
    bcrypt.hash(pass, 10, (err, encr) => {
      if (err) reject(err);
      resolve(encr);
    })
  );

module.exports.compare = (data, pass) =>
  new Promise((resolve, reject) =>
    bcrypt.compare(data, pass, (err, comp) => {
      if (err) reject(err);
      resolve(comp);
    })
  );

module.exports.sign = (id) =>
  new Promise((resolve, reject) =>
    jwt.sign(
      { id },
      "holyshitchangethis",
      { expiresIn: "1d" },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    )
  );

module.exports.verify = (token) =>
  new Promise((resolve, reject) =>
    jwt.verify(token, "holyshitchangethis", (err, res) => {
      if (err) reject(err);
      resolve(res);
    })
  );
