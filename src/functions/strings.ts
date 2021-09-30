import { parser } from "../api/parser";

export default () => {
  const remainder = (str: string, count: number) => {
    let ret = str.split("%").filter(Boolean).splice(0, count).join("%") + "%cn";
    return ret.startsWith("%") ? ret + "%cn" : "%" + ret + "%cn";
  };

  // repeat(<string>, <width>)
  parser.add("repeat", async (args) => {
    const strWidth = parser.stripSubs("telnet", args[0]).length;
    const width = parseInt(args[1], 10);
    const rep = Math.floor(width / strWidth);
    const rem = width - strWidth * rep;
    return args[0].repeat(rep) + remainder(args[0], rem);
  });

  // center(<string>,<width>,<filler>)
  parser.add("center", async (args, data) => {
    const strWidth = parser.stripSubs("telnet", args[0]).length;
  });
};
