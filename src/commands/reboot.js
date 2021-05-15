const { spawn } = require("child_process");

module.exports = {
  name: "@reboot",
  pattern: /@reboot/i,
  flags: "wizard+ connected",
  render: async (args, ctx) => {
    await ctx.mu.broadcast(
      `@reboot initiated by ${ctx.player.name}!  Please hold!`
    );
    process.exit(1);
  },
};
