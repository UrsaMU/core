import { addCmd, config } from "..";
import { dbObj } from "../api/app";
import { send } from "../api/broadcast";
import { force } from "../api/hooks";
import { hash, sign } from "../api/security";
import { handleConnect, id } from "../utils/utils";

export default () => {
  addCmd({
    name: "create",
    pattern: /^create\s+(\w+)\s+(\w+)/i,
    flags: "!connected",
    render: async (ctx, args) => {
      const players = await dbObj.find({ flags: /player/ });
      const regex = new RegExp(args[1], "i");
      const taken = await dbObj.findOne({
        $or: [{ name: regex }, { alias: regex }],
      });

      if (!taken) {
        const player = await dbObj.create({
          dbref: await id(),
          flags: players.length
            ? "player connected"
            : "player connected immortal",
          name: args[1],
          password: await hash(args[2]),
          location: config.get("playerStart") || "#0",
          description: "You see nothing special.",
          data: {},
          channels: [],
        });

        if (player) {
          ctx.player = player;
          const token = await sign(player.dbref);
          if (!ctx.data) ctx.data = {};
          if (token) ctx.data.token = token;

          await handleConnect(ctx);
          force(ctx, "look");
        } else {
          send(ctx.id, "Unable to create character!");
        }
      }
    },
  });
};
