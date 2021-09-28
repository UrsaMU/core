import { app } from "./api/app";
import { hooks } from "./api/hooks";
import cmdHooks from "./hooks/cmdHooks";
import defaultHook from "./hooks/defaultHook";
import { setflags } from "./utils/utils";
import dotenv from "dotenv";
import { DbObj } from "./models/dbobj";
import dbHooks from "./hooks/dbHooks";
import resourceHook from "./hooks/resourceHook";

dotenv.config();

// Install hooks
hooks.start.use(dbHooks, resourceHook);
hooks.input.use(cmdHooks, defaultHook);

// Start the server!
app.listen(3000, async () => {
  await hooks.start.execute({});
  console.log("Game loaded");
});

// If the process is terminated remove everyone's commect flag.
process.on("SIGINT", async () => {
  const players = await DbObj.find({ flags: /connected/i });

  for (const player of players) {
    await setflags(player, "!connected");
  }

  await hooks.shutdown.execute({});
  process.exit(0);
});
