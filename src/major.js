const { app, server } = require("./app");
const { MU } = require("./mu");
const authRoutes = require("./routes/authRoutes");
const gridRoutes = require("./routes/gridRoutes");
const dbRoutes = require("./routes/dbRoutes");
const express = require("express");
const commands = require("./hooks/commands");
const player = require("./hooks/player");
const auth = require("./hooks/auth");
const mux = require("./plugins/mux");
const webAuth = require("./middleware/webAuth");
const mu = new MU(app, server);

// Configure plugins
mu.configure(mux);

// Add the mu instance to any incoming requests.
mu.app.use((req, res, next) => {
  req.mu = mu;
  next();
});

mu.app.use(express.json());
mu.app.use("/api/v1/auth", authRoutes);
mu.app.use("/api/v1/grid", webAuth, gridRoutes);
mu.app.use("/api/v1/db", webAuth, dbRoutes);

mu.hooks.use(player, auth, commands);
mu.start(4200);
