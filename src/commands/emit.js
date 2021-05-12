module.exports = {
  name: "emit",
  pattern: /@?emit\s+(.*)/i,
  flags: "connected",
  render: async (args, ctx) => await ctx.mu.send(ctx.player.location, args[1]),
};
