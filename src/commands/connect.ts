import { send } from "../api/broadcast";
import { addCmd } from "../api/cmds";
import { login } from "../utils/utils";

export default () => {
  addCmd({
    name: "connect",
    hidden: true,
    pattern: /^connect\s+(\w+)\s+(.*)/i,
    flags: "!connected",
    render: async (args, ctx) => {
      ctx.data.name = args[1];
      ctx.data.password = args[2];
      const player = await login(ctx);
      if (!player) await send(ctx.socket, "Permission denied.");
    },
  });
};
