const bcrypt = require("bcrypt");
const { hash } = require("../utils/utils");

module.exports = {
  name: "create",
  pattern: /create\s+(\w+)\s+(\w+)/,
  render: async (args, ctx) => {
    if (ctx.mu.connections.has(ctx.id)) return;

    const regName = new RegExp(args[1], "i");
    const taken = await ctx.mu.db.find({ name: regName });
    const players = await ctx.mu.db.find({ type: "player" });

    if (taken.length)
      return await ctx.mu.send(ctx.id, "That name is unavailable.");

    const player = await ctx.mu.entity(
      args[1],
      players.length ? "player" : "player immortal",
      {
        password: await hash(args[2]),
        location: ctx.mu.config.players.startingRoom || "Limbo",
      }
    );

    const token = await ctx.mu.login(ctx.data.socket, player.name, args[2]);

    await ctx.mu.send(ctx.id, "Character created!", { token });
    ctx.mu.force(ctx, "motd");
    ctx.mu.force(ctx, "look");
  },
};
