import { send } from "../api/broadcast";
import { addCmd } from "../api/cmds";

export default () => {
  addCmd({
    name: "test",
    pattern: ".test bar/*",
    render: async (args, ctx) => {
      send(ctx.socket, "Test Passed! " + args[1], {
        foo: "bar",
      });
    },
  });
};
