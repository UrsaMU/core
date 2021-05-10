const { fork, spawn } = require("child_process");

const options = {
  slient: true,
  detached: true,
  stdio: [null, null, null, "ipc"],
};

// (function main() {
//   const major = spawn("node", ["--inspect", __dirname + "/major.js"]);
//   major.on("exit", () => {
//     major.unref();
//     setTimeout(main, 1000);
//   });

//   process.on("exit", () => {
//     major.kill(major.pid);
//   });
// })();

// let major = fork(__dirname + "/major.js");
let minor = fork(__dirname + "/minor.js");
let major = fork(__dirname + "/major.js");
