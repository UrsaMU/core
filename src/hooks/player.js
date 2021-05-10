module.exports = async (ctx, next) => {
  const char = ctx.mu.connections.get(ctx.id);
  if (char) {
    const player = await ctx.mu.db.get(char.player);
    delete player.password;
    ctx.player = player;
  }
  next();
};
