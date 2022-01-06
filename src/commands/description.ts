import { addCmd, flags, send } from "..";
import { dbObj } from "../api/app";
import { name, target } from "../utils/utils";

export default () => {
  addCmd({
    name: "desc",
    pattern: ".desc *=*",
    flags: "connected",
    render: async (ctx, args) => {
      const tar = await target(ctx, args[1]);

  
      if (
        tar && (flags.check(ctx.player?.flags || "", "wizard+") ||
        tar.data.owner === ctx.player?.dbref
      )) {
        await dbObj.update(
          { dbref: tar.dbref },
          { data: { ...tar.data, ...{ description: args[2] } } }
        );
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
