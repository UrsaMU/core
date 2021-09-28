import { broadcastToLoc, send } from "../api/broadcast";
import { addCmd } from "../api/cmds";
import { force } from "../api/hooks";
import { DbObj } from "../models/dbobj";

export default () => {
  addCmd({
    name: "say",
    flags: "connected",
    pattern: /^(?:s[ay]*?\s+?|")(.*)/i,
    render: async (args, ctx) => {
      const player = await DbObj.findOne({ dbref: ctx.socket.cid });

      if (player) {
        await broadcastToLoc(player.loc, `${player.name} says "${args[1]}"`);
      }
    },
  });
};
