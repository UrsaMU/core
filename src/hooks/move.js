module.exports = async (ctx, next) => {
  // make sure they're logged in first
  if (ctx.player) {
    const contents = await ctx.mu.db.find({ location: ctx.player.location });
    const exits = contents.filter((item) => item.flags.includes("exit"));

    for (const exit of exits) {
      const regex = new RegExp(
        `^${ctx.mu.parser
          .stripSubs("telnet", exit.name.replace(/;/g, "|^"))
          .trim()}`,
        "i"
      );
      const match = ctx.msg.match(regex);

      if (match && exit.to) {
        ctx.data.socket.leave(ctx.player.location);
        ctx.mu.send(ctx.player.location, `${ctx.player.name} has left.`);
        ctx.player.location = exit.to;
        await ctx.mu.db.update({ _id: ctx.player._id }, ctx.player);
        ctx.mu.send(ctx.player.location, `${ctx.player.name} has arrived.`);
        ctx.data.socket.join(ctx.player.location);
        ctx.mu.force(ctx, "look");
        ctx.found = true;
      }
    }
  }

  next();
};
