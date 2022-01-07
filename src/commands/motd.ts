import { addCmd, send, textFiles } from "..";
import { left, repeat } from "../utils/format";
export default () => {
  addCmd({
    name: "motd",
    pattern: "motd",
    flags: "connected",
    render: async (ctx, args) => {
      send(
        ctx.id,
        left("< %chMOTD%cn >", ctx.data?.width, "=") +
          "\n" +
          textFiles.get("motd") +
          "\n" +
          repeat("=", ctx.data?.width)
      );
    },
  });
};
