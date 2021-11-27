import { addCmd } from "..";

export default () => {
  addCmd({
    name: "pose",
    pattern: /^(?:pose\s+|:|;)(.*)/i,
    flags: "connected",
    render: async (ctx) => {},
  });
};
