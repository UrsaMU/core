const moment = require("moment");
const mu = require("../mu");

module.exports = async (ctx) => {
  if (!ctx.found) {
    try {
      for (cmd of ctx.mu.cmds) {
        const match = ctx.msg.match(cmd.pattern);
        if (match) {
          if (
            !cmd.flags ||
            ctx.mu.flags.check(ctx.player?.flags || "", cmd.flags)
          ) {
            await cmd.render(match, ctx);
            ctx.found = true;
            if (ctx.player) {
              ctx.player.lastCommand = Date.now();
              await mu.db.update({ _id: ctx.player._id }, ctx.player);
            }
          }
        }
      }

      if (!ctx.found && ctx.player && ctx.msg !== "")
        mu.send(ctx.id, "Huh? Type 'help' for help.");
    } catch (error) {
      mu.send(ctx.id, `Oops! You've found a bug! ${error.message}`);
    }
  }
};
