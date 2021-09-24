import { send } from "../api/broadcast";
import { addCmd } from "../api/cmds";

export default () => {
  addCmd({
    name: "test",
    pattern: /^[@\+]?test/,
    render: async (args, ctx) => {
      send(ctx.socket, "Test Passed!", {
        foo: "bar",
      });
    },
  });
};
