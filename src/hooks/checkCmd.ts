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
          hooks.commands.get(cmd.name)?.before.execute(ctx);
          await cmd.render(ctx, args);
          hooks.commands.get(cmd.name)?.after.execute(ctx);
        }
      }
      next();
    },
    async (ctx) => {
      if (ctx.msg?.trim()) send(ctx.id, "Huh? Type 'help' for help.");
    }
  );
};
