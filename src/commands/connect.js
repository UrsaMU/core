const bcrypt = require("bcrypt");

module.exports = {
  name: "connect",
  pattern: /connect\s+(\w+)\s+(\w+)/,
  help: `
SYNTAX: connect <character> <password>

Connect to a pre-established character.

See also:  create
  `,
  render: async (args, ctx) => {
    const token = await ctx.mu.login(ctx.data.socket, args[1], args[2]);
    await ctx.mu.send(
      ctx.id,
      token ? "%chWelcome%cn to the %chgame%cn!" : "permission denied.",
      { ...ctx.data, ...{ transmit: { token, login: true } } }
    );
    await ctx.mu.force(ctx, "motd");
    await ctx.mu.force(ctx, "l");
  },
};
