module.exports = {
  name: "quit",
  pattern: /^quit/i,
  render: async (args, ctx) => {
    if (ctx.player) {
      const { tags } = ctx.mu.flags.set(ctx.player.flags, {}, "!connected");
      ctx.player.flags = tags.trim();
      await ctx.mu.db.update(ctx.player._id, ctx.player);
    }
    await ctx.mu.send(ctx.id, "Thanks for visiting! See ya!", {
      transmit: { exit: 1 },
    });
    ctx.data.socket.disconnect();
    if (ctx.player)
      await ctx.mu.send(
        ctx.player.location,
        `${ctx.player.name} has disconnected.`
      );
  },
};
