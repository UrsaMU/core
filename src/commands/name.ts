import { addCmd, flags, logger, send } from "..";
import { dbObj } from "../api/app";
import { target } from "../utils/utils";

export default () => {
  addCmd({
    name: "name",
    pattern: ".name *=*",
    flags: "connected",
    render: async (ctx, args) => {
      const tar = await target(ctx, args[1]);

      if (
        tar &&
        (flags.check(ctx.player?.flags || "", "wizard+") ||
          tar.owner === ctx.player?.dbref)
      ) {
        await dbObj.update(
          { dbref: tar.dbref },
          { name: args[2]  }
        );
        return await send(ctx.id, "Done. Name updated.");
      } else {
        return send(ctx.id, "I can't find that.");
      }
    },
  });
};
