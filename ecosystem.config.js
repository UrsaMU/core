module.exports = {
  apps: [
    {
      name: "telnet",
      script: "index.ts",
      exec_mode: "fork",
      cwd: "./plugins/telnet",
      interpreter: "node",
      interpreter_args:
        "--require ts-node/register --require tsconfig-paths/register",
    },
  ],
};
