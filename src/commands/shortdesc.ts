import { send } from "../api/broadcast";
import { addCmd } from "../api/cmds";
import { canEdit } from "../api/flags";
import { DbObj, IDbObj } from "../models/dbobj";
import { target } from "../utils/utils";

export default () => {
  addCmd({
    name: "@shortdesc",
    pattern: /^[@\+]?shortdesc\s+(.*)\s*=\s*(.*)/i,
    flags: "connected",
    render: async (args, ctx) => {
      const en: IDbObj = await DbObj.findOne({ dbref: ctx.socket.cid });

      const tar = await target(en, args[1]);
      if (en && tar && canEdit(en, tar)) {
        if (args[2]) {
          tar.data.shortDesc = args[2];
        } else {
          delete tar.data.shortdesc;
        }

        tar.markModified("data.shortdesc");
        await tar.save();

        await send(ctx.socket, `Done. Shortdesc set for %ch${tar.name}%cn`);
      } else {
        send(ctx.socket, "Permission denied.");
      }
    },
  });
};
