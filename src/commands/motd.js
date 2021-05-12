module.exports = {
  name: "motd",
  pattern: /motd/i,
  flags: "connected",
  render: async (_, ctx) => {
    const msg =
      "[repeat(%ch-%cn=,78)]%r%r" + ctx.mu.motd + "%r%r[repeat(%ch-%cn=,78)]%r";
    console.log(ctx.player._id);
    await ctx.mu.send(ctx.id, msg);
  },
};
