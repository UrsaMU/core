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

      let output = "\n";
      const name = (target) => {
        if (ctx.mu.flags.check(ctx.player.flags, "staff+")) {
          return `${target.name} (%ch%cx${target._id}-${ctx.mu.flags.codes(
            target.flags.trim()
          )}%cn)\n`;
        } else {
          return target.name + "\n";
        }
      };

      output += name(target);
      output += target.description + "\n";
      output += target.flags.split(" ").includes("player")
        ? "Carrying:"
        : "Contents:";

      contents.forEach((item) => (output += "\n" + name(item)));
      return output;
    };

    args[1] = args[1] ? args[1] : "";

    if (args[1].toLowerCase() === "here" || args[1].toLowerCase() === "") {
      buildDesc(ctx.player.location).then((desc) => ctx.mu.send(ctx.id, desc));
    } else if (args[1].toLowerCase() === "me") {
      buildDesc(ctx.player._id).then((desc) => ctx.mu.send(ctx.id, desc));
    } else {
      buildDesc(args[1]).then((desc) => ctx.mu.send(ctx.id, desc));
    }
  },
};
