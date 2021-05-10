module.exports = {
  name: "@reboot",
  pattern: /@reboot/i,
  flags: "wizard+ connected",
  render: (args, ctx) => {
    ctx.mu.broadcast(`@reboot initiated by ${ctx.player.name}!  Please hold!`);
    process.kill(process.pid);
  },
};
