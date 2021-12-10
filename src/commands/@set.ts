import { addCmd, flags, send } from "..";
import { setFlgs, target } from "../utils/utils";

export default () => {
  addCmd({
    name: "@set",
    pattern: "@set *=*",
    flags: "connected staff+",
    render: async (ctx, args) => {
      const tar = await target(ctx, args[1]);
      console.log(ctx.player);
      if (tar) {
        const flgs = args[2].split(" ");
        for await (const flg of flgs) {
          const flgCpy = flg.startsWith("!") ? flg.slice(1) : flg;
          if (flags.exists(flgCpy)) {
            setFlgs(tar, flg);
            send(
              ctx.id,
              `Done. Flag (%ch${flgCpy}%cn) ${
                flg.startsWith("!") ? "removed from" : "set on"
              } %ch${tar.name}%cn.`
            );
          } else {
            send(ctx.id, `I don't recognize flag: %ch%cy${flg}%cn`);
          }
        }
      } else {
        send(ctx.id, "I can't find that here.");
      }
    },
  });
};
