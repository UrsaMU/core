module.exports = {
  name: "motd",
  pattern: /motd/i,
  flags: "connected",
  render: async (_, ctx) => {
    const msg =
      `[center(%ch<<  Message of the Day  >>%cn,%ch-%cn=, width(%#))]%r%r` +
      ctx.mu.motd +
      `%r%r[repeat(%ch-%cn=, width(%#))]%r`;
    await ctx.mu.send(ctx.id, msg, ctx.data);
  },
};
