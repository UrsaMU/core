import { send } from "../api/broadcast";
import { addCmd } from "../api/cmds";
import { DbObj, IDbObj } from "../models/dbobj";

export default () => {
  addCmd({
    name: "pose",
    pattern: /^(pose\s+|:|;)(.*)/i,
    flags: "connected",
    render: async (args, ctx) => {
      const en: IDbObj = await DbObj.findOne({ dbref: ctx.socket.cid });
      let msg = "";

      switch (args[1].toLowerCase().trim()) {
        case "pose":
          msg = en.name + " " + args[2];
          break;
        case ":":
          msg = `${en.name} ${args[2]}`;
          break;
        case ";":
          msg = `${en.name}${args[2]}`;
          break;
      }

      send(ctx.socket || "", msg, {
        type: "pose",
        name: en.name,
        avatar: en.data.avatar,
      });
    },
  });
};
