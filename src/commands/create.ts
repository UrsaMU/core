import { addCmd } from "..";
import { dbObj } from "../api/app";
import { hash } from "../api/security";
import { handleConnect, id } from "../utils/utils";

export default () => {
  addCmd({
    name: "create",
    pattern: /^create\s+(\w+)\s+(\w+)/i,
    flags: "!connected",
    render: async (ctx, args) => {
      const players = await dbObj.find({});
      const regex = new RegExp(args[1], "i");
      const taken = await dbObj.findOne({
        $or: [{ name: regex }, { alias: regex }],
      });

      if (!taken) {
        const player = await dbObj.create({
          dbref: await id(),
          flags: players.length
            ? "player connected"
            : "plsyer connnected immprtal",
          data: {
            name: args[1],
            password: hash(args[2]),
          },
        });

        if (player) {
          ctx.player = player;
          await handleConnect(ctx);
        }
      }
    },
  });
};
