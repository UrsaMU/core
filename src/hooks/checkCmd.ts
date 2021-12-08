import { flags, matchCmd, SDK, Context, Next, send, logger } from "..";

export default async (ctx: Context, next: Next) => {
  const { args, cmd } = await matchCmd(ctx);
  if (cmd) {
    if (flags.check(ctx.player?.flags || "", cmd.flags || "")) {
      const sdk = new SDK({
        URL: "http://localhost:4201",
        key: ctx.data?.token,
      });

      ctx.sdk = sdk;
      try {
        return await cmd.render(ctx, args);
      } catch (error: any) {
        logger.error(error);
        await send(
          ctx.id,
          "Uh oh! You found a bug! .\nERROR MESSAGE: " + error.message
        );
      }
    }
  }
  next();
};
