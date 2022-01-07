import { addCmd, compare, force, send, sign } from "..";
import { dbObj } from "../api/app";
import { handleConnect } from "../utils/utils";

export default () => {
  addCmd({
    name: "connect",
    pattern: /^connect\s+(\w+)\s+(\w+)/i,
    flags: "!connected",
    render: async (ctx, args) => {
      const regexp = new RegExp(args[1], "i");

      const user = await dbObj.findOne({
        $or: [{ name: regexp }, { alias: regexp }],
      });
      if (user && (await compare(args[2], user.password || ""))) {
        const token = await sign(user.dbref);
        ctx.player = user;
        ctx.data = ctx.data ? ctx.data : {};
        ctx.data.token = token;
        await handleConnect(ctx);
        await force(ctx, "look");
      } else {
        send(ctx.id, "Inavlid Name or Password.", { log: false });
      }
    },
  });
};
