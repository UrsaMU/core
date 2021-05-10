const e = require("cors");

module.exports = {
  name: "Pose",
  flags: "connected",
  pattern: /(pose\s+|:|;)(.*)/,
  render: async (args, ctx) => {
    const conn = ctx.mu.connections.get(ctx.id);
    const player = await ctx.mu.db.get(conn.player);
    const regex = new RegExp(player.location, "i");
    if (player && args[1] != ";") {
      ctx.mu.send(player.location, `${player.name} ${args[2]}`);
    } else if (player) {
      ctx.mu.send(player.location, `${player.name}${args[2]}`);
    }
  },
};
