import { send, flags, hooks, matchCmd, SDK } from "..";

export default () => {
  hooks.input.use(
    async (ctx, next) => {
      const { args, cmd } = await matchCmd(ctx);
      if (cmd) {
        if (flags.check(ctx.player?.flags || "", cmd.flags || "")) {
          const sdk = new SDK({
            URL: "http://localhost:4201",
            key: ctx.data?.token,
          });

          ctx.sdk = sdk;
          return await cmd.render(ctx, args);
        }
      }
      next();
    },
    async (ctx) => {
      send(ctx.id, "Huh? Type 'help' for help.");
    }
  );
};
