const { fork } = require("child_process");

let minor = fork(__dirname + "/minor.js");
let major = fork(__dirname + "/major.js");

major.on("exit", () => {
  minor = fork(__dirname + "/major.js");
});
