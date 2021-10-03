import { send } from "../api/broadcast";
import { addCmd } from "../api/cmds";
import { flags } from "../api/flags";
import { DbObj, IDbObj } from "../models/dbobj";
import { name } from "../utils/formatting";
import { target } from "../utils/utils";

export default () => {
  addCmd({
    name: "@desc",
    flags: "connected",
    pattern: /^@?desc\s+(.*)\s*=\s*(.*)/i,
    render: async (args, ctx) => {
      const en: IDbObj = await DbObj.findOne({ dbref: ctx.socket.cid });
      const tar: IDbObj = await target(en, args[1]);
      if (tar && en) {
        if (en.dbref === tar.owner || flags.check(en.flags || "", "wizard+")) {
          tar.description = args[2];
          await tar.save();
          await send(ctx.socket, `Description for ${name(en, tar)} updated.`);
        } else {
          await send(ctx.socket, "Permission denied.");
        }
      } else {
        send(ctx.socket, "I can't find that player.");
      }
    },
  });
};
