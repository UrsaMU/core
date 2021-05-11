module.exports = {
  name: "Say",
  flags: "connected",
  pattern: /say\s+|"(.*)/,
  render: async (args, ctx) => {
    const conn = ctx.mu.connections.get(ctx.id);
    const player = await ctx.mu.db.get(conn.player);
    const regex = new RegExp(player.location, "i");

    const str = {
      msg: args[1],
      data: { ctx },
      scope: {},
    };

    if (player)
      ctx.mu.send(
        player.location,
        `${player.name} says "${await ctx.mu.parser.string("telnet", str)}"`
      );
  },
};
