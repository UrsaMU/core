import { addCmd, DBObj, send } from "..";
import { center, repeat } from "../utils/format";
import { name, target } from "../utils/utils";

export default () => {
  addCmd({
    name: "look",
    flags: "connected",
    pattern: /^(?:look|l)(?:\s+(.*))?/i,
    render: async (ctx, args) => {
      const tar = await target(ctx, args[1]);

      // Maje sure tar was returned with more than an empty object.
      if (tar?.dbref) {
        // Can they see the object?
        if (
          ctx.player?.location === tar.dbref ||
          ctx.player?.dbref === tar.dbref
        ) {
          let desc = "";
          console.log(ctx.data?.width);
          desc += center(`< ${tar.name} >`, ctx.width, "-") + "\n\n";
          desc += tar.description;
          const contents = await ctx.sdk?.get({ location: tar.dbref });

          if (contents.length) {
            // Is this a room or something else? Is our looker inside?
            desc +=
              "\n\n" +
              center(
                tar.flags.includes("room") ? "< Contents >" : "< Carrying >",
                ctx.width,
                "-"
              ) +
              "\n";
            desc += contents
              .filter((item: DBObj) => !item.flags?.includes("room"))
              .map((item: DBObj) => name(ctx.player!, item))
              .join("\n");
          }

          send(ctx.id, desc);
        } else {
          send(ctx.id, "I can't find that here.");
        }
      }
    },
  });
};
