import { app } from "./api/app";
import { hooks } from "./api/hooks";
import cmdHooks from "./hooks/cmdHooks";
import defaultHook from "./hooks/defaultHook";
import { set } from "./utils/utils";
import dotenv from "dotenv";
import { DbObj } from "./models/dbobj";
import dbHooks from "./hooks/dbHooks";
import resourceHook from "./hooks/resourceHook";
import authHook from "./hooks/authHook";
import { emitter } from "./api/Emitter";
import { broadcastToLoc } from "./api/broadcast";
import { remConn } from "./api/connections";

dotenv.config();

// Install hooks
hooks.start.use(dbHooks, resourceHook);
hooks.input.use(authHook, cmdHooks, defaultHook);

// Start the server!
app.listen(3000, async () => {
  await hooks.start.execute({});
  console.log("Game loaded");
});

emitter.on("connected", (player) => {
  if (!player.flags.includes("dark")) {
    broadcastToLoc(player.loc, `${player.name} has connected.`);
  }
});

emitter.on("disconnected", async (player) => {
  if (player && !player.flags.includes("dark")) {
    await broadcastToLoc(player.loc, `${player.name} has disconnected.`);
    remConn(player.dbref);
  }

  await set(player, "!connected", { temp: {} });
});

// If the process is terminated remove everyone's commect flag.
process.on("SIGTERM", async () => {
  const players = await DbObj.find({ flags: /connected/i });

  for (const player of players) {
    await set(player, "!connected", { temp: {} });
  }

  await hooks.shutdown.execute({});
  process.exit(0);
});
