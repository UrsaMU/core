module.exports = {
  name: "@reboot",
  pattern: /@reboot/i,
  flags: "wizard+ connected",
  render: async (args, ctx) => {
    await ctx.mu.broadcast(
      `@reboot initiated by ${ctx.player.name}!  Please hold!`
    );
    process.kill(process.pid);
  },
};
