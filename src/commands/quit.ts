import { send } from "../api/broadcast";
import { addCmd } from "../api/cmds";
import { hooks } from "../api/hooks";
import { DbObj } from "../models/dbobj";

export default () => {
  addCmd({
    name: "quit",
    pattern: /^quit/i,
    render: async (args, ctx) => {
      const player = await DbObj.findOne({ dbref: ctx.socket.cid });

      await hooks.disconnect.execute(player);
      await send(ctx.socket, "See you space cowboy...", { command: "quit" });

      setTimeout(() => ctx.socket.close(), 10);
    },
  });
};
