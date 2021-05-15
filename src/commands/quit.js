module.exports = {
  name: "quit",
  pattern: /^quit/i,
  render: async (args, ctx) => {
    if (ctx.player) {
      const { tags } = ctx.mu.flags.set(ctx.player.flags, {}, "!connected");
      ctx.player.flags = tags;
      await ctx.mu.db.update(ctx.player._id, ctx.player);
    }
    ctx.mu.send(ctx.id, "Thanks for visiting! See ya!");
    ctx.data.socket.disconnect();
    if (ctx.player)
      await ctx.mu.send(
        ctx.player.location,
        `${ctx.player.name} has disconnected.`
      );
  },
};
