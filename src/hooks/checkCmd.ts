import { send, flags, hooks, matchCmd, SDK, Context, Next } from "..";

export default async (ctx: Context, next: Next) => {
  const { args, cmd } = await matchCmd(ctx);
  if (cmd) {
    if (flags.check(ctx.player?.flags || "", cmd.flags || "")) {
      const sdk = new SDK({
        URL: "http://localhost:4201",
        key: ctx.data?.token,
      });

      ctx.sdk = sdk;
      await cmd.render(ctx, args);
    }
  }
  next();
};
