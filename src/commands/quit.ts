import { send } from "../api/broadcast";
import { addCmd } from "../api/cmds";
import { emitter } from "../api/Emitter";
import { DbObj } from "../models/dbobj";
import { setflags } from "../utils/utils";

export default () => {
  addCmd({
    name: "quit",
    pattern: /^quit/i,
    render: async (args, ctx) => {
      const player = await DbObj.findOne({ dbref: ctx.socket.cid });
      if (player) await setflags(player, "!connected");
      await send(ctx.socket, "See you space cowboy...", { command: "quit" });

      emitter.emit("disconnected", player);
      setTimeout(() => ctx.socket.close(0), 10);
    },
  });
};
