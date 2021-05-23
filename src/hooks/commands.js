module.exports = async (ctx) => {
  if (!ctx.found) {
    for (cmd of ctx.mu.cmds) {
      const match = ctx.msg.match(cmd.pattern);
      if (match) {
        if (
          !cmd.flags ||
          ctx.mu.flags.check(ctx.player?.flags || "", cmd.flags)
        ) {
          await cmd.render(match, ctx);
          ctx.found = true;
        }
      }
    }

    if (!ctx.found && ctx.player && ctx.msg !== "")
      ctx.mu.send(ctx.id, "Huh? Type 'help' for help.");
  }
};
