import { addCmd, send } from "..";

export default () => {
  addCmd({
    name: "test",
    pattern: "+test",
    render: async (ctx, args) => {
      send(ctx.id, "This is a test!!", { en: ctx.id });
    },
  });
};
