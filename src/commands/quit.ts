import { send, setFlag } from "..";
import { addCmd } from "..";
import { setFlgs } from "../utils/utils";

export default () =>
  addCmd({
    name: "quit",
    pattern: "quit",
    render: async (ctx) => {
      await send(ctx.id, "See you space cowboy...", { log: false });
      if (ctx.socket) ctx.socket.disconnect();
      if (ctx.player) await setFlgs(ctx.player, "!connected");
      ctx.res = "See you space cowboy...";
    },
  });
