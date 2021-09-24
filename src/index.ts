import { app } from "./api/app";
import { hooks } from "./api/hooks";
import cmdHooks from "./hooks/cmdHooks";
import defaultHook from "./hooks/defaultHook";

import { loaddir, setflags } from "./utils/utils";
import { join } from "path";
import { existsSync } from "fs";

// Install hooks
hooks.use(cmdHooks, defaultHook);

// Start the server!
app.listen(3000, async () => {
  try {
    await loaddir(join(__dirname, "./commands/"));
    if (existsSync(join(__dirname, "./plugins"))) {
      await loaddir(join(__dirname, "./plugins/"), (file, path) => {});
    }
    console.log("Game loaded");
  } catch (error) {
    console.error(error);
  }
});
