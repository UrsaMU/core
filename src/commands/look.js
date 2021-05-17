const player = require("../hooks/player");

module.exports = {
  name: "look",
  pattern: /^l[ook]*?(?:\s+(.*))?/i,
  flags: "connected",
  render: async (args, ctx) => {
    const buildDesc = async (id) => {
      const regex = new RegExp(id, "i");
      const target = (
        await ctx.mu.db.find({
          $or: [{ name: regex }, { _id: id }],
        })
      )[0];
      if (!target) return "I can't find that here.";
      const contents = await ctx.mu.db.find({ location: target._id });
      const exits = contents.filter((item) => item.flags.includes("exit"));
      let output = "";

      output += (await ctx.mu.name(ctx.player, target)) + "\n";
      output += target.description;
      if (contents.length) {
        output += target.flags.split(" ").includes("player")
          ? "\n\nCarrying:"
          : "\n\nContents:";

        for (const item of contents.filter((item) => {
          if (!item.flags.includes("exit")) {
            if (
              item.flags.includes("player") &&
              !item.flags.includes("connected")
            )
              return false;
            return true;
          }
        })) {
          output += "\n" + (await ctx.mu.name(ctx.player, item));
        }
      }

      if (exits.length) {
        output += "\n\nExits:";

        for (const item of exits) {
          output += "\n" + (await ctx.mu.name(ctx.player, item));
        }
      }

      return output;
    };

    args[1] = args[1] ? args[1] : "";

    if (args[1].toLowerCase() === "here" || args[1].toLowerCase() === "") {
      await ctx.mu.send(ctx.id, await buildDesc(ctx.player.location), ctx.data);
    } else if (args[1].toLowerCase() === "me") {
      await ctx.mu.send(ctx.id, await buildDesc(ctx.player._id));
    } else {
      await ctx.mu.send(ctx.id, await buildDesc(args[1]));
    }
  },
};
