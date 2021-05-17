module.exports = {
  name: "@description",
  pattern: /^[@\+]?desc[ription]*?\s+(\w+)=(.*)/i,
  flags: "connected",
  render: async (args, ctx) => {
    const target = await ctx.mu.target(ctx.player, args[1]);

    if (target) {
      if (
        target.owner === ctx.player._id ||
        ctx.mu.flags.check(ctx.player.flags, "staff+")
      ) {
        target.description = args[2];
        await ctx.mu.db.update({ _id: target._id }, target);
        ctx.mu.send(ctx.id, "Description set.");
      } else {
        ctx.mu.send(ctx.id, "Permission denied.");
      }
    }
  },
};
