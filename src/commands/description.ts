import { addCmd, flags, logger, send } from "..";
import { dbObj } from "../models/DBObj";
import { name, target } from "../utils/utils";

export default () => {
  addCmd({
    name: "desc",
    pattern: ".desc *=*",
    flags: "connected",
    render: async (ctx, args) => {
      const tar = await target(ctx, args[1]);

      if (
        flags.check(ctx.player?.flags || "", "wizard+") ||
        tar?.owner === ctx.player?.dbref
      ) {
        await dbObj.updateOne({ dbref: tar?.dbref }, { description: args[2] });
        return await send(
          ctx.id,
          `Done. description for ${name(ctx.player!, tar)} updated.`
        );
      } else {
        return await send(ctx.id, "I can't find that.");
      }
    },
  });
};
