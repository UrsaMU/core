import { parser } from "../api/parser";
import { center, repeat } from "../utils/formatting";

export default () => {
  const remainder = (str: string, count: number) => {
    let ret = str.split("%").filter(Boolean).splice(0, count).join("%");
    let len = parser.stripSubs("telnet", str).length;
    return str.includes("%c") && len > 1 ? "%" + ret + " %cn" : ret;
  };
  // repeat(<string>, <width>)
  parser.add("repeat", async (args) => {
    return repeat(args[0], parseInt(args[1], 10));
  });

  // center(<string>,<width>,<filler>)
  parser.add("center", async (args, data) => {
    const words = args[0] || "";
    const width = parseInt(args[1]) || 78;
    const filler = args[2] || " ";

    return center(args[0], width, filler);
  });
};
