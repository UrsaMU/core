import { flags, hooks, matchCmd } from "..";

export default () => {
  hooks.input.use(async (ctx, next) => {
    const { args, cmd } = await matchCmd(ctx);
    if (cmd && flags.check(ctx.player?.flags || "", cmd.flags || "")) {
      return await cmd.render(ctx, args);
    }
    next();
  });
};
