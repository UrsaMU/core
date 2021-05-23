module.exports = {
  name: "motd",
  pattern: /motd/i,
  flags: "connected",
  render: async (_, ctx) => {
    const msg =
      `[repeat(%ch-%cn=, ${ctx.socket.width})]%r%r` +
      ctx.mu.motd +
      `%r%r[repeat(%ch-%cn=, ${ctx.socket.width})]%r`;
    await ctx.mu.send(ctx.id, msg, ctx.data);
  },
};
