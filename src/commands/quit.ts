import { send, setFlag } from "..";
import { addCmd } from "..";
import { setFlgs } from "../utils/utils";

export default () =>
  addCmd({
    name: "quit",
    pattern: "quit",
    render: async (ctx) => {
      console.log("made it!!");
      console.log(ctx.socket);
      if (ctx.socket) {
        await send(ctx.id, "See you space cowboy...", {
          log: false,
          quit: true,
        });
        if (ctx.socket) ctx.socket.disconnect();
        if (ctx.player) await setFlgs(ctx.player, "!connected");
      }
      ctx.res = "See you space cowboy...";
    },
  });
