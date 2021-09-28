import { send } from "../api/broadcast";
import { addCmd } from "../api/cmds";
import { canEdit } from "../api/flags";
import { DbObj } from "../models/dbobj";
import { target } from "../utils/utils";

export default () => {
  addCmd({
    name: "name",
    pattern: /^[@\+]?name\s+(.*)\s*=\s*(.*)/i,
    flags: "connected",
    render: async (args, ctx) => {
      const player = await DbObj.findOne({ dbref: ctx.socket.cid });
      const tar = await target(player, args[1]);

      if (canEdit(player, tar)) {
        tar.name = args[2];
        await tar.save();
        await send(ctx.socket, "Done. Object name set.");
      } else {
        await send(ctx.socket, "Permission denied.");
      }
    },
  });
};
