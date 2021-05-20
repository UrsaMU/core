import { app } from "./app";
import { MU } from "./mu";
import authRoutes from "./routes/authRoutes";
import gridRoutes from "./routes/gridRoutes";
import dbRoutes from "./routes/dbRoutes";
import wikiRoutes from "./routes/wikiRoutes";
import express from "express";
import commands from "./hooks/commands";
import player from "./hooks/player";
import auth from "./hooks/auth";
import move from "./hooks/move";
import mux from "./plugins/mux";
import webAuth from "./middleware/webAuth";
const mu = new MU(app);

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
