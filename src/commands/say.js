module.exports = {
  name: "Say",
  flags: "connected",
  pattern: /^say\s+|^"(.*)/,
  render: async (args, ctx) => {
    const conn = ctx.mu.connections.get(ctx.id);
    const player = await ctx.mu.db.get(conn.player);
    const regex = new RegExp(player.location, "i");

    if (player)
      await ctx.mu.send(
        player.location,
        `${player.name} says "${args[1]}"`,
        ctx.data
      );
  },
};
