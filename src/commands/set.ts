import { send } from "../api/broadcast";
import { addCmd } from "../api/cmds";
import { canEdit, flags } from "../api/flags";
import { DbObj, IDbObj } from "../models/dbobj";
import { name } from "../utils/formatting";
import { set, target } from "../utils/utils";

export default () => {
  addCmd({
    name: "set",
    pattern: /[@\+]?set(?:\/(.*))?\s+(.*)(?:\s*=\s*(.*))/i,
    flags: "connected",
    render: async (args, ctx) => {
      const en: IDbObj = await DbObj.findOne({ dbref: ctx.socket.cid });
      const tar: IDbObj = await target(en, args[2]);
      const modifier = args[1] || "";
      const rtrnList = [];

      // bssic validity checks
      if (!tar) return send(ctx.socket, "I can't find that.");
      if (!en && !canEdit(en, tar))
        return send(ctx.socket, "Permission denied.");
      if (/:/g.test(args[3])) {
        // Setting an attribute
      } else {
        // Setting a flag list
        const flgs = [...new Set(args[3].split(" "))];
        for (let flg of flgs) {
          const curFlg = flags.exists(flg.startsWith("!") ? flg.slice(1) : flg);

          if (curFlg && flags.check(en.flags, curFlg.lock || "")) {
            await set(tar, flg);
            rtrnList.push(
              `%chDone.%cn flag (%ch${curFlg.name.toUpperCase()}%cn) ${
                flg.startsWith("!") ? "removed from" : "set on"
              } %ch${name(en, tar)}%cn.`
            );
          } else {
            send(ctx.socket, "Permission denied.");
          }
        }
      }
    },
  });
};
