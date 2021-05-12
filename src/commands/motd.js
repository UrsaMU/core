module.exports = {
  name: "motd",
  pattern: /motd/i,
  flags: "connected",
  render: async (_, ctx) => {
    const msg =
      `[repeat(%ch-%cn=,${ctx.data.width})]%r%r` +
      ctx.mu.motd +
      `%r%r[repeat(%ch-%cn=,${ctx.data.width})]%r`;
    console.log(ctx.player._id);
    await ctx.mu.send(ctx.id, msg);
  },
};
