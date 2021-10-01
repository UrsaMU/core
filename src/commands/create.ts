import { addCmd } from "../api/cmds";
import { DbObj } from "../models/dbobj";
import { send } from "../api/broadcast";
import { hash, id, sign } from "../utils/utils";
import { emitter } from "../api/Emitter";
import { conns } from "../api/connections";
import { force } from "../api/hooks";

export default () => {
  addCmd({
    name: "create",
    hidden: true,
    pattern: /^create\s+(\w+)\s+(.*)/i,
    render: async (args, ctx) => {
      const exists = await DbObj.findOne({ name: new RegExp(args[1], "i") });
      if (exists) return send(ctx.socket, "That name is unavailable.");
      const players = await DbObj.find({ flags: /player/i });
      const player = await DbObj.create({
        name: args[1],
        dbref: await id(),
        password: await hash(args[2]),
        loc: "#0",
        flags:
          players.length > 0
            ? "connected player newbie"
            : "connected player newbie immortal",
      });

      player.owner = player.dbref;
      await player.save();
      const token = await sign(player.dbref, process.env.SECRET || "");
      ctx.socket.cid = player.dbref;
      conns.push(ctx.socket);
      await send(ctx.socket, "Connected!", { token });
      emitter.emit("connected", player);
      await force(ctx, "look");
    },
  });
};
