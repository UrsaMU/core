import { send } from "../api/broadcast";
import { addCmd } from "../api/cmds";
import { conns } from "../api/connections";
import { emitter } from "../api/Emitter";
import { DbObj } from "../models/dbobj";
import { setflags } from "../utils/utils";

export default () => {
  addCmd({
    name: "connect",
    hidden: true,
    pattern: /^connect\s+(\w+)\s+(.*)/i,
    render: async (args, ctx) => {
      const player = await DbObj.findOne({ name: new RegExp(args[1], "i") });
      if (!player) return send(ctx.socket, "I can't find that character.");

      ctx.socket.cid = player.dbref;
      conns.push(ctx.socket);

      const obj = await setflags(player, "connected");
      send(ctx.socket, "COnnected!!");
      emitter.emit("connected", obj);
    },
  });
};
