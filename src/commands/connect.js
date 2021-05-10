const bcrypt = require("bcrypt");

module.exports = {
  name: "connect",
  pattern: /connect\s+(\w+)\s+(\w+)/,
  render: async (args, ctx) => {
    const token = await ctx.mu.login(ctx.data.socket, args[1], args[2]);
    ctx.mu.send(
      ctx.id,
      token ? "%chWelcome%cn to the %chgame%cn!" : "permission denied.",
      { token, login: true }
    );
  },
};
