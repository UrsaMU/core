import { addCmd, DBObj, send } from "..";
import { name, target } from "../utils/utils";

export default () => {
  addCmd({
    name: "look",
    flags: "connected",
    pattern: /^(?:look|l)(?:\s+(.*))/,
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
          desc += tar.name + "\n";
          desc += tar.description;
          const contents = await ctx.sdk?.get({ location: tar.dbref });

          if (contents.length) {
            // Is this a room or something else? Is our looker inside?
            desc += tar.flags.includes("room")
              ? "\n\nContents:\n"
              : "\n\nCarrying:\n";
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
