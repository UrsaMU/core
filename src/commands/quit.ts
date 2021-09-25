import { send } from "../api/broadcast";
import { addCmd } from "../api/cmds";
import { setflags } from "../utils/utils";

export default () => {
  addCmd({
    name: "quit",
    pattern: /^quit/i,
    render: async (args, ctx) => {
      if (ctx.player) await setflags(ctx.player, "!connected");
      await send(ctx.socket, "See you space cowboy...");
      setTimeout(() => ctx.socket.close(), 10);
    },
  });
};
