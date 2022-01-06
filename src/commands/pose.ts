import { addCmd, send } from "..";

export default () => {
  addCmd({
    name: "pose",
    pattern: /^(pose\s+|:|;)(.*)/i,
    flags: "connected",
    render: async (ctx, args) => {
      send(
        ctx.player?.location || "",
        `${ctx.player?.name}${args[1].startsWith(";") ? "" : " "}${args[2]}`
      );
    },
  });
};
