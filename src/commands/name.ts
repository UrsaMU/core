import { addCmd, flags, logger, send } from "..";
import { dbObj } from "../models/DBObj";
import { target } from "../utils/utils";

export default () => {
  addCmd({
    name: "name",
    pattern: "name *=*",
    flags: "connected",
    render: async (ctx, args) => {
      const tar = await target(ctx, args[1]);

      if (
        flags.check(ctx.player?.flags || "", "wizard+") ||
        tar?.owner === ctx.player?.dbref
      ) {
        try {
          await dbObj.updateOne({ dbref: tar?.dbref }, { name: args[2] });
          await send(ctx.id, "Done. Name updated.");
        } catch (error: any) {
          logger.error(error.message);
        }
      } else {
        send(ctx.id, "I can't find that.");
      }
    },
  });
};
