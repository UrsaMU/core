import { send } from "../api/broadcast";
import { addCmd } from "../api/cmds";
import { conns } from "../api/connections";
import { emitter } from "../api/Emitter";
import { login } from "../utils/utils";

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
        send(ctx.socket, "Connected!!");
        emitter.emit("connected", player);
      } else {
        send(ctx.socket, "Permission denied.");
      }
    },
  });
};
