import { addCmd, send } from "..";
import { chans } from "../models/Chans";

export default () => {
  addCmd({
    name: "@ccreate",
    pattern: "@ccreate *",
    flags: "connected staff+",
    render: async (ctx, args) => {
      const parts = args[1].split("=");
      const name = parts[1].trim();

      chans.create({ name, header: `%ch[${name}]%cn` });
      send(ctx.id, `Done. Channel %ch${name}%cn created.`);
    },
  });
};
