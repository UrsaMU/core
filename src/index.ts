import { app } from "./api/app";
import { hooks } from "./api/hooks";
import cmdHooks from "./hooks/cmdHooks";
import defaultHook from "./hooks/defaultHook";
import mongoose from "mongoose";
import { id, loaddir, setflags } from "./utils/utils";
import { join } from "path";
import dotenv from "dotenv";
import { DbObj } from "./models/dbobj";
import { plugins } from "./api/plugins";

dotenv.config();

// Install hooks
hooks.use(cmdHooks, defaultHook);

// Start the server!
app.listen(3000, async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECT_STRING || "");

    // Check for rooms.  If there are none, drop limbo.
    const rooms = await DbObj.find({ flags: /room/i });
    if (rooms.length <= 0) {
      await DbObj.create({
        name: "Limbo",
        flags: "room",
        dbref: await id(),
      });
    }

    // load resources
    await loaddir(join(__dirname, "./commands/"));
    await loaddir(join(__dirname, "./scripts/"));
    await plugins();

    console.log("Game loaded");
  } catch (error) {
    console.error(error);
  }
});

// If the process is terminated remove everyone's commect flag.
process.on("SIGTERM", async () => {
  const players = await DbObj.find({ flags: /connected/i });
  for (const player of players) {
    await setflags(player, "!connected");
  }

  setTimeout(() => process.exit(0), 300);
});
