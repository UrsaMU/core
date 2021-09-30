import { parser } from "../api/parser";

export default () => {
  parser.add("width", async (args, data) => data.width);
};
