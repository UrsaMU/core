module.exports = {
  name: "@dig",
  pattern: /[@\+]?dig(?:\/(\w+)?)?\s(.*)/i,
  flags: "connected wizard+",
  render: async (args, ctx) => {
    const slash = args[1];
    const [nRoom, exits] = args[2]?.split("=");
    const [tExit, fExit] = (exits || "").split(",");

    const room = await ctx.mu.entity(nRoom, "room", {
      owner: ctx.player._id,
    });
    ctx.mu.send(
      ctx.id,
      `%chDone%cn. Room %ch${await ctx.mu.name(ctx.player, room)}%cn dug.`
    );

    if (tExit) {
      const toExit = await ctx.mu.entity(tExit, "exit", {
        owner: ctx.player._id,
        location: ctx.player.location,
      });
      ctx.mu.send(
        ctx.id,
        `%chDone%cn.%cn Exit %ch${await ctx.mu.name(
          ctx.player,
          toExit
        )}%cn opened`
      );
    }

    if (fExit) {
      const fromExit = await ctx.mu.entity(fExit, "exit", {
        owner: ctx.player._id,
        location: room._id,
      });
      ctx.mu.send(
        ctx.id,
        `%chDone%cn.%cn Exit %ch${await ctx.mu.name(
          ctx.player,
          fromExit
        )}%cn opened`
      );
    }

    if (slash && slash.match(/t[eleport]*?/i)) {
      ctx.data.socket.leave(ctx.player.location);
      ctx.player.location = room._id;
      await ctx.mu.db.update({ _id: ctx.player._id }, ctx.player);
      await ctx.mu.send(ctx.id, "Teleporting!");
      ctx.data.socket.join(ctx.player.location);
      ctx.mu.force(ctx, "look");
    }
  },
};
