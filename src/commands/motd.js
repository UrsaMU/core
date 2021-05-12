module.exports = {
  name: "motd",
  pattern: /motd/i,
  flags: "connected",
  render: async (_, ctx) => {
    const msg =
      "//".repeat(78 / 2) +
      "\n\n" +
      ctx.mu.motd +
      "\n\n" +
      "//".repeat(78 / 2) +
      "\n";
    console.log(ctx.player._id);
    await ctx.mu.send(ctx.id, msg);
  },
};
