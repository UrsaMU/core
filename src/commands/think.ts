import { send } from "../api/broadcast";
import { addCmd } from "../api/cmds";

export default () => {
  addCmd({
    name: "think",
    pattern: "think *",
    flags: "connected",
    render: async (args, ctx) => send(ctx.socket, args[1], ctx.data),
  });
};
