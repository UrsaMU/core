module.exports = async (ctx, next) => {
  for (cmd of ctx.mu.cmds) {
    const match = ctx.msg.match(cmd.pattern);
    if (match) {
      if (ctx.mu.flags.check(ctx.player?.flags || "", cmd.flags || "")) {
        await cmd.render(match, ctx);
        ctx.found = true;
      }
    }
  }
  next();
};
