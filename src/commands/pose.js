const e = require("cors");

module.exports = {
  name: "Pose",
  flags: "connected",
  pattern: /^(pose\s+|:|;)(.*)/i,
  render: async (args, ctx) => {
    const conn = ctx.mu.connections.get(ctx.id);
    const player = await ctx.mu.db.get(conn.player);
    const regex = new RegExp(player.location, "i");
    if (player && args[1] != ";") {
      await ctx.mu.send(player.location, `${player.name} ${args[2]}`, ctx.data);
    } else if (player) {
      await ctx.mu.send(player.location, `${player.name}${args[2]}`, ctx.data);
    }
  },
};
