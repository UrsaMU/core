import { broadcast } from "../api/broadcast";
import { addCmd } from "../api/cmds";
import { DbObj, IDbObj } from "../models/dbobj";

export default () => {
  addCmd({
    name: "@reboot",
    pattern: /^@reboot/i,
    flags: "connected wizard+",
    render: async (args, ctx) => {
      const en: IDbObj = await DbObj.findOne({ dbref: ctx.socket.cid });
      await broadcast(`Game Reboot by %ch${en.name}%cn. Please wait!`);
      setTimeout(() => process.exit(0), 800);
    },
  });
};
