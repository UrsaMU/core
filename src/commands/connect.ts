import { send } from "../api/broadcast";
import { addCmd } from "../api/cmds";
import { conns } from "../api/connections";
import { emitter } from "../api/Emitter";
import { login, sign } from "../utils/utils";

export default () => {
  addCmd({
    name: "connect",
    hidden: true,
    pattern: /^connect\s+(\w+)\s+(.*)/i,
    flags: "!connected",
    render: async (args, ctx) => {
      const player = await login({ name: args[1], password: args[2] });

      if (player) {
        ctx.socket.cid = player.dbref;
        conns.push(ctx.socket);
        const token = await sign(player.dbref, process.env.SECRET || "");
        await send(ctx.socket, "Connected!!", { token });
        emitter.emit("connected", player);
      } else {
        await send(ctx.socket, "Permission denied.");
      }
    },
  });
};
