import { execSync } from "child_process";
import { broadcast } from "../api/broadcast";
import { addCmd } from "../api/cmds";
import { DbObj, IDbObj } from "../models/dbobj";

export default () => {
  addCmd({
    name: "shutdown",
    pattern: "@shutdown",
    flags: "wizard+",
    render: async (args, ctx) => {
      const en: IDbObj = await DbObj.findOne({ dbref: ctx.socket.cid });
      await broadcast(`${en.name} is shutting down the game.  Goodbye!!`);
      execSync("pm2 delete telnet");
      execSync("pm2 delete ursamu");
    },
  });
};
