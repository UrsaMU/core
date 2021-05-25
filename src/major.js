const mu = require("./mu");
const authRoutes = require("./routes/authRoutes");
const gridRoutes = require("./routes/gridRoutes");
const dbRoutes = require("./routes/dbRoutes");
const wikiRoutes = require("./routes/wikiRoutes");
const express = require("express");
const commands = require("./hooks/commands");
const player = require("./hooks/player");
const auth = require("./hooks/auth");
const move = require("./hooks/move");
const mux = require("./plugins/mux");
const webAuth = require("./middleware/webAuth");

// Add the mu instance to any incoming requests.
mu.app.use((req, res, next) => {
  req.mu = mu;
  next();
});
// Configure plugins
mu.configure(mux);

mu.app.use(express.json());
mu.app.use("/api/v1/auth", authRoutes);
mu.app.use("/api/v1/grid", webAuth, gridRoutes);
mu.app.use("/api/v1/db", webAuth, dbRoutes);
mu.app.use("/api/v1/wiki/", wikiRoutes);

mu.hooks.use(auth, player, move, commands);
mu.start(4200);

process.on("uncaughtException", (err) => console.log(err));
