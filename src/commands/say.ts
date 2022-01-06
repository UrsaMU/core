import { addCmd, send } from "..";

export default () => {
  addCmd({
    name: "say",
    flags: "connected",
    pattern: /^(?:say\s+|")(.*)/i,
    render: async (ctx, args) =>
      send(
        ctx.player?.location || "",
        `${ctx.player?.name} says "${args[1]}%cn"`
      ),
  });
};
