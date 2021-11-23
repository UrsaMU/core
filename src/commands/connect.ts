import { addCmd, compare, send, sign } from "..";
import { dbObj } from "../models/DBObj";
import { handleConnect } from "../utils/utils";

export default () => {
  addCmd({
    name: "connect",
    pattern: /^connect\s+(\w+)\s+(\w+)/i,
    flags: "!connected",
    render: async (ctx, args) => {
      const regexp = new RegExp(args[1], "i");
      console.log("Made it!!!");
      const user = await dbObj.findOne({
        $or: [{ name: regexp }, { alias: regexp }],
      });

      if (user && (await compare(args[2], user.password || ""))) {
        user.password = undefined;
        ctx.player = user;
        handleConnect(ctx);
      }
    },
  });
};
