import { send } from "../api/broadcast";
import { addCmd } from "../api/cmds";
import { DbObj, IDbObj } from "../models/dbobj";

export default () => {
  addCmd({
    name: "@doing",
    flags: "connected",
    pattern: /^[@\+]doing(?:\s+(.*))?/,
    render: async (args, ctx) => {
      const player: IDbObj = await DbObj.findOne({ dbref: ctx.socket.cid });

      if (player && args[1]) {
        player.data.doing = args[1];
        await send(ctx.socket, `Done. %ch@doing%cn set.`);
      } else if (player && !args[1]) {
        player.data.doing = "";
        await send(ctx.socket, "Done. %ch@doing%cn cleared.");
      }

      player.markModified("data.doing");
      await player.save();
    },
  });
};
