import { app } from "./api/app";
import { hooks } from "./api/hooks";
import cmdHooks from "./hooks/cmdHooks";
import defaultHook from "./hooks/defaultHook";
import dotenv from "dotenv";
import { DbObj } from "./models/dbobj";
import dbHooks from "./hooks/dbHooks";
import resourceHook from "./hooks/resourceHook";
import authHook from "./hooks/authHook";
import connectHook from "./hooks/connectHook";
import disconnectHooks from "./hooks/disconnectHooks";
import reconnectHooks from "./hooks/reconnectHooks";

dotenv.config();

// Install hooks
hooks.start.use(dbHooks, resourceHook);
hooks.connect.use(connectHook);
hooks.disconnect.use(disconnectHooks);
hooks.reconnect.use(reconnectHooks);
hooks.input.use(authHook, cmdHooks, defaultHook);

// Start the server!
app.listen(3000, async () => {
  await hooks.start.execute({});
  console.log("Game loaded");
});

// If the process is terminated remove everyone's commect flag.
process.on("SIGINT", async () => {
  const players = await DbObj.find({ flags: /connected/i });

  for (const player of players) {
    await hooks.disconnect.execute(player);
  }

  await hooks.shutdown.execute({});
  setTimeout(() => process.kill(process.pid), 1200);
});
