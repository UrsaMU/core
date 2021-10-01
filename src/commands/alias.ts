import { send } from "../api/broadcast";
import { addCmd } from "../api/cmds";
import { DbObj, IDbObj } from "../models/dbobj";
import { target } from "../utils/utils";

export default () => {
  addCmd({
    name: "aalias",
    pattern: /^[@\+]alias\s+(.*)\s*=\s*(\w+)/i,
    flags: "connected",
    render: async (args, ctx) => {
      const en: IDbObj = await DbObj.findOne({ dbref: ctx.socket.cid });

      const tar = await target(en, args[1]);

      const exists: IDbObj[] = await DbObj.find({
        $and: [
          { name: new RegExp(args[2], "i") },
          { alias: new RegExp(args[2], "i") },
        ],
      });

      if (exists.length <= 0) {
        if (tar) {
          tar.alias = args[2].toLowerCase();
          await tar.save();
          await send(
            ctx.socket,
            `Alias (${args[2].toUpperCase()}) for ${tar.name} set.`
          );
        } else {
          await send(ctx.socket, "I can't find that.");
        }
      } else {
        await send(ctx.socket, "That alias is unavaliable.");
      }
    },
  });
};
