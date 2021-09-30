import { parser } from "../api/parser";

export default () => {
  parser.add("add", async (args) => parseInt(args[0], 10) + parseInt(args[1]));
  parser.add("sub", async (args) => parseInt(args[0], 10) - parseInt(args[1]));
  parser.add("mul", async (args) => parseInt(args[0], 10) * parseInt(args[1]));
  parser.add("div", async (args) => parseInt(args[0], 10) / parseInt(args[1]));
  parser.add("mod", async (args) => parseInt(args[0], 10) % parseInt(args[1]));
  parser.add("pow", async (args) => parseInt(args[0], 10) ** parseInt(args[1]));
};
