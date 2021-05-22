const { verify } = require("../utils/utils");

module.exports = async (ctx, next) => {
  const conn = ctx.mu.connections.get(ctx.id);
  if (ctx.data.token && !conn) {
    const id = await verify(ctx.data.token);
    let player = await ctx.mu.db.get(id.id);

    if (player) {
      const { tags } = ctx.mu.flags.set(player.flags, {}, "connected");
      player.flags = tags;
      await ctx.mu.db.update({ _id: id.id }, player);
      ctx.mu.connections.set(ctx.id, {
        socket: ctx.data.socket,
        player: player._id,
      });
      ctx.player = player;
      ctx.data.socket.join(player._id);
      ctx.data.socket.join(player.location);
    }
  }

  next();
};
