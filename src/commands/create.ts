import { addCmd } from "..";
import { handleConnect } from "../utils/utils";

export default () => {
  addCmd({
    name: "create",
    pattern: /^create\s+(\w+)\s+(\w+)/i,
    flags: "!connected",
    render: async (ctx, args) => {
      const player = await ctx.sdk?.createPlayer(args[1], args[2]);
      if (player) {
        ctx.player = player;
        await handleConnect(ctx);
      }
    },
  });
};
