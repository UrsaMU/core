const e = require("cors");

module.exports = {
  name: "+stats",
  pattern: /^[\+@]?stats(?:\/(\w+))?\s+(\w+)\/(\w+)\s*?=\s*?(.*)/i,
  flags: "wizard+ connected",
  render: async (args, ctx) => {
    const match = args[3].match(/^(str|con|siz|int|pow|dex|app|edu)/i);
    const target = await ctx.mu.target(ctx.player, args[2]);
    const value = parseInt(args[4], 10);

    switch (args[1].toLowerCase()) {
      case "set":
        if (target && match && value) {
          target[args[3].toLowerCase()] = value;
          await ctx.mu.db.update({ _id: ctx.player._id }, ctx.player);
          ctx.mu.send(
            ctx.id,
            `Done. %ch${await ctx.mu.name(
              ctx.player,
              target
            )}'s%cn ${args[3].toUpperCase()} set to %ch${value}%cn`
          );
        } else {
          if (!match) ctx.mu.send(ctx.id, "That's not a valid stat.");
          if (!value) ctx.mu.send(ctx.id, "That's not a proper number.");
          if (!target) ctx.mu.send(ctx.id, "I can't find that!.");
        }
        break;
    }
  },
};
