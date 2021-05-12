const player = require("../hooks/player");

module.exports = {
  name: "look",
  pattern: /l[ook]*?(?:\s+(.*))?/i,
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

      let output = "";
      const name = (target) => {
        if (ctx.mu.flags.check(ctx.player.flags, "staff+")) {
          return `${target.name} (%ch%cx${target._id}-${ctx.mu.flags.codes(
            target.flags.trim()
          )}%cn)`;
        } else {
          return target.name;
        }
      };

      output += name(target) + "\n";
      output += target.description + "\n\n";
      output += target.flags.split(" ").includes("player")
        ? "Carrying:"
        : "Contents:";

      contents.forEach((item) => (output += "\n" + name(item)));
      return output;
    };

    args[1] = args[1] ? args[1] : "";

    if (args[1].toLowerCase() === "here" || args[1].toLowerCase() === "") {
      await ctx.mu.send(ctx.id, await buildDesc(ctx.player.location), ctx.data);
    } else if (args[1].toLowerCase() === "me") {
      await ctx.mu.send(ctx.id, await buildDesc(ctx.player._is));
    } else {
      await ctx.mu.send(ctx.id, await buildDesc(args[1]));
    }
  },
};
